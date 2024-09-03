import { Link as RouterLink, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";

function InformationView() {

    const { id } = useParams();
    const URL = 'http://localhost:5265';
    const [informationList, setInformation] = useState([]);
    const [picMain, setPicMain] = useState([]);
    const [picSub, setPicSub] = useState([]);
    const [infoLink, setInfoLink] = useState([]);

    const getInformation = async () => {
        try {
            const response = await fetch(`${URL}/api/Information/${id}`);
            const data = await response.json();
            setInformation(data);
            getInformationByType(data.type_ID);
        } catch (error) {
            console.error('Error fetching information:', error);
        }
    };

    const getInformationPicMain = async () => {
        try {
            const responsePic = await fetch(`${URL}/api/Picture/picMain/${id}`);
            const dataPic = await responsePic.json();
            setPicMain(dataPic);
        } catch (error) {
            console.error('Error fetching informationPicMain:', error);
        }
    };

    const getInformationPicSub = async () => {
        try {
            const responsePic = await fetch(`${URL}/api/Picture/picSub/${id}`);
            const dataPic = await responsePic.json();
            setPicSub(dataPic);
        } catch (error) {
            console.error('Error fetching informationPicSub:', error);
        }
    };

    const getInformationByType = async (id) => {
        try {
            const response = await fetch(`${URL}/api/Information/type/${id}`);
            const data = await response.json();
            setInfoLink(data);
        } catch (error) {
            console.error('Error fetching informationByType:', error);
        }
    };


    useEffect(() => {
        getInformation();
        getInformationPicMain();
        getInformationPicSub();
    }, []);

    return (
        <div>
            <div className="head">
                {informationList.headlines}
            </div>
            <div >
                {picMain.map((picMain) => (
                    <div key={picMain.id} >
                        <img
                            src={`${URL}${picMain.filePath}`}
                            className="picMain"
                            alt={picMain.picType}
                        />
                    </div>
                ))}
                <div className="infodetail">
                    {informationList.detail}
                </div>
            </div>
            <div className="picsub">
                {picSub.map((picSub) => (
                    <div key={picSub.id} className="picsub-item">
                        <img
                            src={`${URL}${picSub.filePath}`}
                            className="picsubsize"
                            alt={picSub.picType}
                        />
                    </div>
                ))}
            </div>
            <div className="headlink">
                ข่าวสารเกี่ยวข้อง
            </div>
            <div className="listInfoLink">
                {infoLink.map((info) => (
                    <div key={info.id} className="link">
                        <img
                            src={`${URL}${info.filePath}`}
                            className="item-image"
                            alt={info.picType}
                        />
                        <div className="linkheadline">{info.headlines}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InformationView;