import { useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil';
import { allCountriesAtom, allRegionsAtom, authAtom, countriesAtom, donortypesAtom, indicationsAtom, reportAtom, reportlistAtom, centerAtom, centersAtom } from '../_state';
import axios from "axios";
import { message } from 'antd';
import { v4 as uuid } from 'uuid';


function useDataActions () {
    const [auth, setAuth] = useRecoilState(authAtom);
    const setCenter = useSetRecoilState(centerAtom);
    const setCenters = useSetRecoilState(centersAtom);
    const setDonortypes = useSetRecoilState(donortypesAtom);
    const setIndications = useSetRecoilState(indicationsAtom);
    const setCountries = useSetRecoilState(countriesAtom)
    const setReport = useSetRecoilState(reportAtom);
    const setAllCountries = useSetRecoilState(allCountriesAtom);
    const setAllRegions = useSetRecoilState(allRegionsAtom);
    const setReportlist = useSetRecoilState(reportlistAtom);
    // reset status
    const resetReport = useResetRecoilState(reportAtom);
    const resetReportlist = useResetRecoilState(reportlistAtom);


    const instance = axios.create({
        headers: {
          "Content-Type": "application/json",
        },
        // baseURL: 'https://gtr.nulyse.com/api/',
        baseURL: 'http://127.0.0.1:8000/api/',

        timeout: 10000,
        params : {}
      });
      
      instance.interceptors.request.use(
        (config) => {
          const token = auth?.access 
          if (token) {
            config.headers["Authorization"] = 'Bearer ' + token;  // for Django Boot back-end
            // config.headers["x-access-token"] = token; // for Node.js Express back-end
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
      instance.interceptors.response.use(
        (res) => {
          return res;
        },
        async (err) => {
          let originalConfig = err.config;
          if (originalConfig.url !== "/auth/token/obtain/" && err.response) {
            // Access Token was expired
            if (err.response.status === 401 && !originalConfig._retry) {
              originalConfig._retry = true;
              try {
                const rs = await instance.post("/auth/token/refresh/", {
                  refresh: auth?.refresh // || sessionStorage.getItem("token")?.refresh
                });
                const { accessToken } = rs.data;
                setAuth(accessToken);
                return instance(originalConfig);
              } catch (_error) {
                return Promise.reject(_error);
              }
            }
          }
          return Promise.reject(err);
        }
      );

    return{
        getDonortypes,
        getIndications,
        getAllCountries,
        getAllRegions,
        aggregateReports,
        getCenterDetails,
        getCenters,
        updateCenter,
        getReport,
        listReports,
        saveReport,
        updateReport,
        createReport,
        resetAllCountries: useResetRecoilState(allCountriesAtom),
        resetAllRegions: useResetRecoilState(allRegionsAtom),
        resetAllCenters: useResetRecoilState(centersAtom),
      }

    async function getDonortypes() {
        const res = await instance.get('donortypes/');
        setDonortypes(res.data.sort((n1: { rank: number; }, n2: { rank: number; }) => n1.rank - n2.rank));
        // console.info("Donortypes loaded");
    };

    async function getIndications() {
        const res = await instance.get('indications/');
        setIndications(res.data.sort((n1: { rank: number; }, n2: { rank: number; }) => n1.rank - n2.rank));
        // console.info("Indications loaded");
    };

    async function getAllCountries() {
      const res = await instance.get('countries/');
      setAllCountries(res.data.sort((n1: { iso: number; }, n2: { iso: number; }) => n1.iso - n2.iso));
      // console.info("All countries loaded", res);
    };

    async function getAllRegions() {
      const res = await instance.get('regions/');
      setAllRegions(res.data.sort((n1: { id: number; }, n2: { id: number; }) => n1.id - n2.id));
      // console.info("All regions loaded");
    };

    async function getCenterDetails(id: string = uuid()) {
      const res = await instance.get('center/'+id);
      const center = res.data;
      setCenter(center);
    };

    async function getCenters() {
      const res = await instance.get('centers/');
      const centers = res.data.sort((n1: { wbmt_id: number; }, n2: { wbmt_id: number; }) => n1.wbmt_id - n2.wbmt_id);
      setCenters(centers);
      console.info("Centers loaded", centers);
      var resArr = res.data.filter(function(country_name: string, country_iso: string) {
        var key = `${country_name}${country_iso}`;
        return !this.has(key) && this.add(key);
      }, new Set()).map((x: { country_name: string; country_iso: string; }) => {return {text: x.country_name + " (" + x.country_iso + ")", value: x.country_iso}}).sort((n1: { text: string; },n2: { text: string; }) => {return n1.text.localeCompare(n2.text)});
      setCountries(resArr);
    };

    /**
     * Update the center information
     * @param {*} data 
     * @param {*} params 
     */
    async function updateCenter(data:any, params:any) {
      try {
        console.log("Updating Parameters:", params)
        console.log("Update Data to:", data)
        const res = await instance.put(`centers/${params.id}/`, data);
        console.log("Response", res.data)
        message.success({
          content: 'Infomation updated.',
        })
      } catch (error) {
        message.error('Sheet could not be saved due to a server error.')
        console.error(error)
    }
  }

    async function aggregateReports(params: any) {
        try {
            const res = await instance
                .get('reports/aggregate/', { 
                  params,
                  // paramsSerializer: params => {
                  //   return qs.stringify(params, {arrayFormat: 'brackets'})
                  // }
                  }
                 );
            console.log("Got Response from API", res);
            // eslint-disable-next-line no-unused-expressions
            if (res.data) {
              setReport(res.data)
              return(res.data)
            } else {
              resetReport()
              return null
            }
          }
           catch (error) {
            console.error("Got no Response from API");
            resetReport()
        }
    }
    async function listReports(params: any) {
      try {
          const res = await instance.get('reports/lists/', { params });
          console.log("Got Response from API", res);
          res.data ? (setReportlist(res.data)) : resetReportlist();
      } catch (error) {
          console.log("Got an error:", error);
      }
  };

    async function getReport(params:any) {
        try {
            const res = await instance.get('reports/', { params });
            console.log("Got Response from API", res);
            if (res.data) {
              setReport(res.data.slice(-1)[0])
              return(res.data)
            }
            else {
              resetReport()
              return null
            };

        } catch (error) {
            console.log(error);
        }
    };

    async function createReport(data:any, params:any) {
        try {
            console.log("Load Parameters:", params)
            const res = await instance.post('reports/', data, params);
            console.log(res);
            // console.log(res.slice(-1)[0]);
            setReport(res.data)
            message.success('Sheet saved.');
        } catch (error) {
            message.error('Sheet could not be saved due to a server error.')
            console.error(error)
        }
    }

    async function updateReport(data: any, params: { id: any; }) {
        try {
          console.log("Load Parameters:", params)
          const res = await instance.put(`reports/${params.id}/`, data);
          setReport(res.data)
          message.success('Sheet updated.');
      } catch (error) {
          message.error('Sheet could not be saved due to a server error.')
          console.error(error)
      }
    }

    async function saveReport(data:any, params:any) {
        if (params.id){
          console.log("Update existing report", params)
          return updateReport(data, params)
        } else {
          console.log("Create new report")
          return createReport(data, params)
        };
      }


    // async function deleteReport(params:any) {
    //     console.log("Load Parameters:", params)
    //     const res = await instance.delete('reports', params);
    //     console.log(res.slice(-1)[0]);
    //     setReport(res.slice(-1)[0]);
    // }


}

export { useDataActions };
