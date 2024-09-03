import React, { useState, useEffect } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Textarea from '@mui/joy/Textarea';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Link as RouterLink, useParams } from "react-router-dom";

import Stack from "@mui/material/Stack";
import { ButtonGroup } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Container from "@mui/material/Container";
import { DataGrid } from "@mui/x-data-grid";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function InformationEdit() {

    const URL = 'http://localhost:5265';
    const [type, setType] = React.useState([]);
    const [headline, setHeadline] = React.useState("");
    const [detail, setDetail] = React.useState("");
    const [typeID, setTypeID] = React.useState(0);
    const [files, setFiles] = React.useState([]);
    const [fileName, setFileName] = useState("");
    const [fileMain, setFileMain] = React.useState([]);
    const [fileNameMain, setFileNameMain] = useState("");
    const [fileSub, setFileSub] = React.useState([]);
    const [fileNameSub, setFileNameSub] = useState("");
    const [info, setInfo] = React.useState([]);
    const [infoType, setInfoType] = React.useState([]);
    const { id } = useParams();
    const [rowId, setrowID] = React.useState("");
    const [rowID, setRowID] = React.useState("");
    const [picMain, setPicMain] = useState([]);
    const [picSub, setPicSub] = useState([]);

    const handleChange = (event) => {
        setTypeID(event.target.value); // อัปเดต typeId เมื่อผู้ใช้เลือกตัวเลือก
        console.log('lll ',event.target.value);
        
    };

    const handleFileChange = (event) => {
        setFiles(event.target.files[0]);
        const file = event.target.files[0]; // เก็บเฉพาะไฟล์แรกที่เลือก
        if (file) {
            setFileName(file.name); // อัปเดต state ด้วยชื่อไฟล์
        } else {
            setFileName(""); // หากไม่มีไฟล์ถูกเลือก
        }
    };

    const handleFileMainChange = (event) => {
        setFileMain(event.target.files[0]);
        const file = event.target.files[0]; // เก็บเฉพาะไฟล์แรกที่เลือก
        if (file) {
            setFileNameMain(file.name); // อัปเดต state ด้วยชื่อไฟล์
        } else {
            setFileNameMain(""); // หากไม่มีไฟล์ถูกเลือก
        }
    };

    const handleFileSubChange = (event) => {
        setFileSub(event.target.files[0]);
        const file = event.target.files[0]; // เก็บเฉพาะไฟล์แรกที่เลือก
        if (file) {
            setFileNameSub(file.name); // อัปเดต state ด้วยชื่อไฟล์
        } else {
            setFileNameSub(""); // หากไม่มีไฟล์ถูกเลือก
        }
    };

    const handleDeletePicMain = async (id) => {
        console.log("Deleting information with id:", id);
        try {
            const response = await fetch(`${URL}/api/Picture/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log("Deleted successfully");
                // Fetch the updated list of information
                const updatedResponse = await getInformationPicMain();
                const updatedData = await updatedResponse.json();
                setFileMain(updatedData);
            } else {
                console.error('Failed to delete information');
            }
        } catch (error) {
            console.error('Error deleting information:', error);
        }
    };

    const handleDeletePicSub = async (id) => {
        console.log("Deleting information with id:", id);
        try {
            const response = await fetch(`${URL}/api/Picture/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log("Deleted successfully");
                // Fetch the updated list of information
                const updatedResponse = await getInformationPicSub();
                const updatedData = await updatedResponse.json();
                setFileSub(updatedData);
            } else {
                console.error('Failed to delete information');
            }
        } catch (error) {
            console.error('Error deleting information:', error);
        }
    };


    const handleSubmitOne = async (e) => {
        // e.preventDefault();

        const formData = new FormData();
        formData.append("file", files);
        formData.append("Headlines", info.headlines);
        formData.append("Detail", info.detail);
        formData.append("Type_ID", typeID);

        try {
            const response = await fetch(`${URL}/api/Information/${id}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Validation errors:', errorData.errors);
            } else {
                const result = await response.json();
                console.log('Success:', result);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSubmitPicMain = async (e) => {
        const formData = new FormData();
        formData.append("file", fileMain);
        formData.append("picType", "main");
        formData.append("Information_ID", id);

        try {
            const response = await fetch(`${URL}/api/Picture/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Validation errors:', errorData.errors);
            } else {
                const result = await response.json();
                getInformationPicMain();
                console.log('Success:', result);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleSubmitPicSub = async () => {
        const formData = new FormData();
        formData.append("file", fileSub);
        formData.append("picType", "sub");
        formData.append("Information_ID", id);

        try {
            const response = await fetch(`${URL}/api/Picture/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Validation errors:', errorData.errors);
            } else {
                const result = await response.json();
                await getInformationPicSub()
                console.log('Success:', result);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleHeadlineChange = (event) => {
        setInfo(prevInfo => ({ ...prevInfo, headlines: event.target.value }));
    };

    const handleDetailChange = (event) => {
        setInfo(prevInfo => ({ ...prevInfo, detail: event.target.value }));
    };

    const getInformationType = async () => {
        try {
            const response = await fetch(`${URL}/api/InformationType`);
            const data = await response.json();
            setType(data);
        } catch (error) {
            console.error('Error fetching information:', error);
        }
    };

    // const getInformationTypeByTD = async () => {
    //     try {
    //         const response = await fetch(`${URL}/api/InformationType/${info.type_id}`);
    //         const data = await response.json();
    //         setInfoType(data);
    //     } catch (error) {
    //         console.error('Error fetching information:', error);
    //     }
    // };

    const getInformationByTD = async () => {
        try {
            const response = await fetch(`${URL}/api/Information/${id}`);
            const data = await response.json();
            setInfo(data);
            setTypeID(data.type_ID);

            const res = await fetch(`${URL}/api/InformationType/${data.type_ID}`);
            const d = await res.json();
            setInfoType(d);
            
            
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

    useEffect(() => {
        getInformationType();
        getInformationByTD();
        getInformationPicSub();
        getInformationPicMain();
    }, []);

    const columnss = [
        { field: "id", headerName: "ลำดับ", width: 150 },
        { field: "fileName", headerName: "ชื่อไฟล์", width: 600 },
        {
            field: "action", headerName: "ลบ", width: 100, sortable: false, renderCell: ({ row }) =>
                <ButtonGroup>
                    <Stack spacing={2} direction="row">
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                console.log("rowId:", rowID);  // ตรวจสอบว่า rowId มีค่าหรือไม่
                                handleDeletePicMain(Number(rowID));
                            }}
                        >
                            <DeleteForeverIcon />
                        </Button>
                    </Stack>
                </ButtonGroup>
        },
    ];

    const columns = [
        { field: "id", headerName: "ลำดับ", width: 150 },
        { field: "fileName", headerName: "ชื่อไฟล์", width: 600 },
        {
            field: "action", headerName: "ลบ", width: 100, sortable: false, renderCell: ({ row }) =>
                <ButtonGroup>
                    <Stack spacing={2} direction="row">
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                console.log("rowId:", rowID);  // ตรวจสอบว่า rowId มีค่าหรือไม่
                                handleDeletePicSub(Number(rowId));
                            }}
                        >
                            <DeleteForeverIcon />
                        </Button>
                    </Stack>
                </ButtonGroup>
        },
    ];

    return (
        <div>
            <div className="createOne">
                <div style={{ marginTop: '30px', marginRight: '50px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="success" onClick={handleSubmitOne}>บันทึก</Button>
                    {/* <Button variant="contained">ย้อนกลับ</Button> */}
                </div>
                <div className="infoCreate">
                    <div className="infoCreateCover">
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                        >
                            อัพโหลดรูปปกข่าว
                            <VisuallyHiddenInput
                                type="file"
                                onChange={handleFileChange}
                                multiple
                            />
                        </Button>
                        <div style={{ marginLeft: '30px' }}>{info.cover_pic}</div> {/* แสดงชื่อไฟล์ที่ถูกเลือก */}
                        {/* <label className="icon" style={{ marginLeft: '10px' }}>
                            <DeleteIcon color='error' onClick={() => handleDelet(info.id)} />
                        </label> */}
                    </div>
                    <div className="select">
                        <FormControl fullWidth variant="outlined">
                            <Select
                                native
                                value={type.type_detail}
                                onChange={handleChange}
                            >
                                <option aria-label="None" value={infoType.Id}>
                                    {infoType.type_detail}
                                </option>
                                {type.map((item) => (
                                    <option value={item.id} key={item.id}>
                                        {item.type_detail}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='textaeraMain'>
                        <Textarea
                            minRows={3}
                            placeholder="เพิ่มหัวข้อข่าวสาร"
                            value={info.headlines}
                            onChange={handleHeadlineChange}
                        />
                    </div>
                    <div className='textaeraSub'>
                        <Textarea
                            minRows={6}
                            placeholder="เพิ่มเนื้อหาข่าวสาร"
                            value={info.detail}
                            onChange={handleDetailChange}
                        />
                    </div>
                </div>
            </div>

            <div className="createPic">
                <div className="infoCreatePicMain" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                    >
                        อัพโหลดรูปหลัก
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleFileMainChange}
                            multiple
                        />
                    </Button>
                    <div style={{ marginLeft: '30px', justifyContent: "start" }}>{fileNameMain}</div> {/* แสดงชื่อไฟล์ที่ถูกเลือก */}
                    {/* <label className="icon" style={{ marginLeft: '10px' }}>
                        <DeleteIcon color='error' onClick={() => handleDelet(info.id)} />
                    </label> */}
                    <div>
                        <div style={{ marginRight: '50px', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" color="success" onClick={handleSubmitPicMain}>บันทึก</Button>
                        </div>
                    </div>
                </div>
                <div className="table">
                    <Container maxWidth="md">
                        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
                            <DataGrid
                                rows={picMain}
                                getRowId={(row) => row.id}
                                columns={columnss}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                onRowClick={(params) => {
                                    console.log(params.row.id);
                                    setRowID(params.row.id)

                                }}
                            />
                        </div>
                    </Container>
                </div>
            </div>

            <div className="createTwo">
                <div className="infoCreatePicMain" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                    >
                        อัพโหลดรูปข่าว
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleFileSubChange}
                            multiple
                        />
                    </Button>
                    <div style={{ marginLeft: '30px' }}>{fileNameSub}</div>
                    <div style={{ marginRight: '50px', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="success" onClick={handleSubmitPicSub}>บันทึก</Button>
                    </div>
                </div>
                <div className="table">
                    <Container maxWidth="md">
                        <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
                            <DataGrid
                                rows={picSub}
                                getRowId={(row) => row.id}
                                columns={columns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                onRowClick={(params) => {
                                    console.log(params.row.id);
                                    setrowID(params.row.id)

                                }}
                            />
                        </div>
                    </Container>
                </div>
            </div>
        </div>
    )
}

export default InformationEdit;