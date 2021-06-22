import React from 'react'
import numeral from "numeral";
import "./Map.css"
import {MapContainer as LeafletMap, TileLayer} from "react-leaflet";
import { showDataOnMap } from "./util";

function Map({center,casesType,countries, zoom}) {
    return (
        <>
            <div className="map">
                <LeafletMap center={center} zoom={zoom} >
                {console.log("Inside movies")}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
                    {showDataOnMap(countries, casesType)}
                </LeafletMap>
            </div>
            
        </>
    )
}

export default Map
