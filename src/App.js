import React, {useState, useEffect} from 'react'
import{
  MenuItem, FormControl, Select,CardContent,Card,
} from "@material-ui/core"
import './App.css';
import InfoBox from './InfoBox';
import Table from './Table';
import Map from './Map';
import {sortData , prettyPrintStat} from './util'
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountires] =  useState([]);
  const [country, setCountry] =  useState(['worldwide']);
  const [countryInfo, setCountryInfo] =  useState({});
  const [tableData, setTableData] =  useState([]);
  const [mapCenter, setmapCenter] =  useState([42, 1.6]);
  const [zoom, setZoom] =  useState(3);
  const [mapCountries, setmapCountries] =  useState([]);
  const [casesType, setCasesType] = useState('cases');


// console.log(countryInfo)

console.log(mapCenter)
// console.log(tableData)

  useEffect(()=>{
    const getCountriesData = async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=> response.json(),
      )
      .then((data)=>{
        const countries = data.map((country)=>(
          {
          name : country.country,
          value : country.countryInfo.iso2,
          cases : country.cases
        }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountires(countries);
        setmapCountries(data);
      });
    }
    getCountriesData();
  },[]);

  const onCountryChange = async(e)=>{
    const countryCode = e.target.value;
    setCountry(countryCode);
    const url = countryCode ==="worldwide" ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
    .then(response=>response.json())
    .then(data =>{
       setCountryInfo(data);
       if (countryCode === "worldwide") {} else {
        setmapCenter([data.countryInfo.lat, data.countryInfo.long])
               setZoom(4);

       }
       
      // console.log(data);

      // console.log(data);
    });
    // console.log(countryCode);
  }
  useEffect(()=>{
     fetch("https://disease.sh/v3/covid-19/all")
    .then(response=>response.json())
    .then(data =>{
      setCountryInfo(data);
     
      // console.log(data);
    });

  },[])
  return (
    <>
      <div className="app">
        <div className="app_left">
          <div className="app_header">
            <h1>COVID-19 TRACKER</h1>
            <FormControl className="app_dropdown">
              <Select className="outlined" value={country} onChange={onCountryChange}>
                <MenuItem value="worldwide">WorldWide</MenuItem>
                {
                  countries.map((country, i)=>(
                    <MenuItem value={country.value} key={i}>{country.name}</MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </div>
          <div className="app_stats">
            <InfoBox isRed active={casesType === "cases"} onClick={(e)=> setCasesType('cases')} title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
            <InfoBox active={casesType === "recovered"} onClick={(e)=> setCasesType('recovered')} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
            <InfoBox  active={casesType === "deaths"} onClick={(e)=> setCasesType('deaths')} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>

          </div>
            <Map casesType={casesType} center={mapCenter} countries={mapCountries} zoom={zoom} />
        </div>
        <Card className="app_right">
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData}/> 
            <h3>Worldwide new Cases</h3>
            <LineGraph casesType={casesType}/>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default App;
