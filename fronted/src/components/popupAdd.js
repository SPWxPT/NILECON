import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Textarea from '@mui/joy/Textarea';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';

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

function PopupAdd() {
    const URL = 'http://localhost:5265';
    const [open, setOpen] = React.useState(false);
    const [type, setType] = React.useState([]);
    const [headline, setHeadline] = React.useState("");
    const [typeID, setTypeID] = React.useState(0);
    const [files, setFiles] = React.useState([]);
    const [fileName, setFileName] = useState("");
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        setTypeID(event.target.value); // อัปเดต typeId เมื่อผู้ใช้เลือกตัวเลือก
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

    const handleSubmit = async (e) => {
        // e.preventDefault();

        const formData = new FormData();
        formData.append("file", files);
        formData.append("Headlines", headline);
        formData.append('Detail', "-");
        formData.append("type_ID", typeID);
        // ตรวจสอบข้อมูลใน formData
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await fetch(`${URL}/api/Information`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Validation errors:', errorData.errors);
            } else {
                const result = await response.json();
                console.log('Success:', result);
                const { id } = result;
                navigate(`/information/edit/${id}`);
            }
        } catch (error) {
            console.error("Error:", error);
        }
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

    useEffect(() => {
        getInformationType();
    }, []);

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleClickOpen}>
                เพิ่มข่าวสาร
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"สร้างข้อมูลข่าวสาร"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload Cover Image
                            <VisuallyHiddenInput
                                type="file"
                                onChange={handleFileChange}
                                multiple
                            />
                        </Button>
                        <div>{fileName}</div> {/* แสดงชื่อไฟล์ที่ถูกเลือก */}
                        <div></div>
                        <div className='textaera'>
                            <Textarea
                                minRows={6}
                                placeholder="เพิ่มหัวข้อข่าวสาร"
                                value={headline}
                                onChange={(event) => setHeadline(event.target.value)}
                            />
                        </div>
                        <div style={{ marginTop: "15px" }}>
                            <FormControl fullWidth variant="outlined">
                                <Select
                                    native
                                    value={type.type_detail}
                                    onChange={handleChange}
                                >
                                    <option aria-label="None" value="0">
                                        กรุณาเลือกชนิดข้อมูล
                                    </option>
                                    {type.map((item) => (
                                        <option value={item.id} key={item.id}>
                                            {item.type_detail}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="success" onClick={handleSubmit} autoFocus>
                        บันทึก
                    </Button>
                    <Button color="error" onClick={handleClose}>ยกเลิก</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default PopupAdd;
