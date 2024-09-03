import './App.css';
import React, { useState, useEffect } from "react";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// import Button from '@mui/material/Button';
import PopupAdd from './popupAdd';
import InformationView from './informationView';
import { useNavigate } from 'react-router-dom';

function InformationList() {
    const URL = 'http://localhost:5265';
    const [informationList, setInformation] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    // กำหนด state สำหรับสถานะของ Switch
    const [edit, setEdit] = useState(false);

    // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงสถานะของ Switch
    const handleChange = (event) => {
        setEdit(event.target.checked);
    };

    const handleLabelClick = (id) => {
        navigate(`/information/${id}`);
    };

    // const handleLabelClickCreate = () => {
    //     navigate(`/information/create`);
    // };

    const handleLabelClickEdit = (id) => {
        navigate(`/information/edit/${id}`);
    };

    const handleDelete = async (id) => {
        console.log("Deleting information with id:", id);
        try {
            const response = await fetch(`${URL}/api/Information/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log("Deleted successfully");
                // Fetch the updated list of information
                const updatedResponse = await getInformation();
                const updatedData = await updatedResponse.json();
                setInformation(updatedData);
            } else {
                console.error('Failed to delete information');
            }
        } catch (error) {
            console.error('Error deleting information:', error);
        }
    };

    const getInformation = async () => {
        try {
            const response = await fetch(`${URL}/api/Information`);
            const data = await response.json();
            setInformation(data);
        } catch (error) {
            console.error('Error fetching information:', error);
        }
    };

    useEffect(() => {
        getInformation();
    }, []);


    return (
        <div>
            <div className="Infobar">
                <p>ข้อมูลข่าวสาร</p>
            </div>
            <div className='Info'>
                <p>ข้อมูลข่าวสาร ทั้งหมด</p>
                <div>
                    {/* <Button onClick={handleOpen} variant="contained">เพิ่มข่าวสาร</Button> */}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={edit}
                                onChange={handleChange}
                                name="editSwitch"
                                color="primary"
                            />
                        }
                        label="แก้ไขข้อมูล"
                    />
                    <PopupAdd />
                </div>
            </div>
            <div className="item-container">
                {informationList.map((info) => (
                    <div key={info.id} className="item">
                        <img src={`${URL}${info.filePath}`}
                            className="item-image"
                            alt={info.headlines} />
                        <label
                            className="item-text"
                            onClick={() => handleLabelClick(info.id)}
                        >
                            {info.headlines}
                        </label>
                        {/* ซ่อน div นี้เมื่อ checked เป็น false */}
                        {edit && (
                            <div className='icon'>
                                <label
                                    className="icon"
                                    onClick={() => handleLabelClickEdit(info.id)}
                                >
                                    <EditIcon color='warning' />
                                </label>
                                <label className="icon">
                                    <DeleteIcon color='error' onClick={() => handleDelete(info.id)} />
                                </label>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    )
}

export default InformationList;