import React, { useState } from 'react'
import { Typography, Form, Input, Button, Icon, message } from 'antd'
import Dropzone from 'react-dropzone'
import Axios from 'axios'

const { Title } = Typography
const { TextArea } = Input

const PrivateOptions = [
    {value: 0, label: "Pravate"},
    {value: 1, label: "Public"}
]

const CategoryOptions = [
    {value: 0, label: "Film & Animation"},
    {value: 1, label: "Autos & Vehicles"},
    {value: 2, label: "Music"},
    {value: 3, label: "Pets & Animals"},
]

function VideoUploadPage() {

    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film & Animation")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }
    const onDiscriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }
    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }
    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: {'conent-type': 'multipart/form-data'}
        }
        formData.append("file", files[0])

        Axios.post('/api/video/uploadfiles', formData, config)
        .then(response => {
            if(response.data.success) {
                console.log("upload success data " , response.data)

                let variable = {
                    url: response.data.url,
                    filename: response.data.filename
                }

                setFilePath(response.data.url)

                Axios.post('/api/video/thumbnail', variable)
                .then(response => {
                    if(response.data.success) {
                        console.log(response.data)
                        setDuration(response.data.fileDuration)
                        setThumbnailPath(response.data.url)

                    } else {
                        alert('썸네일 생성 실패')
                    }
                })

            } else {
                alert('업로드 실패')
            }
        })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>
            <Form onSubmit>
                <div style={{ display: 'flex', justifyContent:'space-between' }}>

                    <Dropzone 
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={100000000}
                    >
                        { ({ getRootProps, getInputProps }) => (
                            <div style={{ width:'300px', height: '240px', border: '1px solid lightgray', display:'flex', alignItems:'center', justifyContent:'center' }} {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize:'3rem' }} />
                            </div>
                        )}
                    </Dropzone>

                    {ThumbnailPath &&
                    <div>
                        <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail"></img>
                    </div>
                    }
                </div>

                <br />
                <br />
                <label>Title</label>
                <Input 
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea 
                    onChange={onDiscriptionChange}
                    value={Description}
                />
                <br />
                <br />

                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <br />
                <br />

                <select onChange={onCategoryChange}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>

                <br />
                <br />
                <Button type="primary" size="large">
                    Submit
                </Button>

            </Form>
        </div>
    )
}

export default VideoUploadPage
