import { allCountriesAtom, allRegionsAtom, donortypesAtom, indicationsAtom, centersAtom } from '../_state';
import { useRecoilValue } from 'recoil';

export function BuildSelector(e:any) {
  const indications = useRecoilValue(indicationsAtom)
  const donortypes = useRecoilValue(donortypesAtom)
  // init forms
    if (e === indications) {
      const list = e.map((i: { indication_id: any; indication_txt: String; }) => ({
        value: i.indication_id,
        label: i.indication_txt,
      }))
      return list
    }
    else if ( e === donortypes ) {
      const list = e.map((i: { donor_type_id: any; donor_type_txt: String; }) => ({
        value: i.donor_type_id,
        label: i.donor_type_txt,
      }))
      return list
    }
    else 
      return e 
  }

export const BuildCascader = () => {
    const centers = useRecoilValue(centersAtom);
    const allCountries = useRecoilValue(allCountriesAtom);
    const allRegions = useRecoilValue(allRegionsAtom);
    // return centers
    const centerlist_transition = centers
    // console.info("centerlist_transition:", centerlist_transition)
    const centerlist_regions = [...new Set(centerlist_transition.map(ro => ro.region))];
    const regions = allRegions.filter(reg => centerlist_regions.includes(reg.id))
    // console.log("Regions found: ", centerlist_regions, allRegions, regions);
    const centerlist_countries = [...new Set(centerlist_transition.map(ro => ro.country_iso))];
    const countries = allCountries.filter(cou => centerlist_countries.includes(cou.iso))
    // console.log("Countries found: ", centerlist_countries, allCountries, countries);

    var country_organizations = []
    if (centerlist_transition.filter(co => co.type === "CO").length !== 0) {
      country_organizations = centerlist_transition.filter(co => co.type === "CO")
    } else {
      country_organizations = countries
    }
  
    var region_organizations = []
    var cascaderoptions = []

    if (centerlist_transition.filter(ro => (ro.type === "RO" || ro.type === "HO")).length === 0) {
      region_organizations = regions;
      // administer no region organization but countries within
      if (region_organizations.length > 1) {
        cascaderoptions = region_organizations.map(d0 => ({
        value: d0.id,
        label: (d0.get_id_display + " [" + d0.id + "]"),
        children:
        centerlist_transition.filter(co => co.type === "CO" && co.region === d0.id).map(d1 => ({
            value: d1.id,
            label: (d1.country_name + ' [' + d1.wbmt_id + ']'),
            children:
            centerlist_transition.filter(tc => tc.type === "TC" && tc.region === d1.region && tc.country_iso === d1.country_iso).map(d2 => ({
                value: d2.id,
                label: (d2.city + ', ' + d2.name + ' [' + d2.wbmt_id + ']'),
            }))
          }))
        }))
      }
      // only one region
      // multiple countries or one country organization to administer
      else if (countries.length > 1 || country_organizations.length > 0){
        cascaderoptions = centerlist_transition.filter(co => co.type === "CO").map(d1 => ({
          value: d1.id,
          label: (d1.country_name + ' [' + d1.wbmt_id + ']'),
          children:
          centerlist_transition.filter(tc => tc.type === "TC" && tc.region === d1.region && tc.country_iso === d1.country_iso).map(d2 => ({
            value: d2.id,
            label: (d2.city + ', ' + d2.name + ' [' + d2.wbmt_id + ']'),
          }))
        }))
      }
      else {
        cascaderoptions = centerlist_transition.filter(tc => tc.type === "TC").map(d2 => ({
          value: d2.id,
          label: (d2.city + ', ' + d2.name + ' [' + d2.wbmt_id + ']'),
      }))
      }
    } else {
      region_organizations = centerlist_transition.filter(ro => (ro.type === "RO" || ro.type === "HO"));
      // administer at least one region organization
      if (region_organizations.length > 1) {
        cascaderoptions = region_organizations.map(d0 => ({
          value: d0.id,
          label: (d0.name + " [" + d0.region + "]"),
          children:
          centerlist_transition.filter(co => co.type === "CO" && co.region === d0.region).map(d1 => ({
              value: d1.id,
              label: (d1.country_name + ' [' + d1.wbmt_id + ']'),
              children:
              centerlist_transition.filter(tc => tc.type === "TC" && tc.region === d1.region && tc.country_iso === d1.country_iso).map(d2 => ({
                  value: d2.id,
                  label: (d2.city + ', ' + d2.name + ' [' + d2.wbmt_id + ']'),
              }))
            }))
        }))
      }
      // multiple countries or one country organization to administer
      else if (countries.length > 1 || country_organizations.length > 0) {
        cascaderoptions =  centerlist_transition.filter(co => co.type === "CO").map(d1 => ({
          value: d1.id,
          label: (d1.country_name + ' [' + d1.wbmt_id + ']'),
          children:
          centerlist_transition.filter(tc => tc.type === "TC" && tc.region === d1.region && tc.country_iso === d1.country_iso).map(d2 => ({
            value: d2.id,
            label: (d2.city + ', ' + d2.name + ' [' + d2.wbmt_id + ']'),
          }))
        }))
      }
      //only one country
      else {
        cascaderoptions =  centerlist_transition.filter(tc => tc.type === "TC").map(d2 => ({
            value: d2.id,
            label: (d2.city + ', ' + d2.name + ' [' + d2.wbmt_id + ']'),
        }));
      //TODO: What happens if no country to administer but administer TC in multiple countries
    }
  }
  return cascaderoptions
}