## Build Setup 

```bash 
# Tech Stack
# backend .NET version 8.0.302
# front using react
# database using  sqlite

# install dependencies
$ npm i
$ dotnet restore

# frontend at http://localhost:3000/
$ npm start

# build backend at http://localhost:5265/swagger/index.html
$ dotnet run
```

## Tables

### Information table

| Field Name    | Data Type    | Description                  |
|------------   |-----------   |------------------------------|
| id            | int       | เก็บ ID                       |
| Headlines     | string       | หัวข้อข่าว                      |
| Detail        | string       | รายละเอียดข่าว                 | 
| Cover_pic        | string       | เก็บรูปปกข่าว|             
| FilePath        | string       | เก็บ path รูป|  
| Type_ID        | int       | เก็บ fk ตาราง informaionType|            

### InformationType table

| Field Name | Data Type | Description                    |
|------------|-----------|--------------------------------|
| id         | int    | เก็บ ID                         |
| Type_detail     | string    | เก็บว่าเป็นข่าวประเภทอะไร        |


### Picture Table

| Field Name           | Data Type | Description               |
|----------------------|-----------|---------------------------|
| id                   | int    | เก็บ ID         |
| FileName                | string    | เก็บชื่อรูป      |
| FilePath          | string    | เก็บ path รูป|
| PicType  | string    | เก็บชนิดรูป      |
| Information_ID           | int    | เก็บ fk ตาราง information    |

```




