import React, { useState } from 'react'
import { Typography, Form, Input, Button, Icon, message } from 'antd'
import Dropzone from 'react-dropzone'
import Axios from 'axios'
import { useSelector} from 'react-redux'

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

function VideoUploadPage(props) {
    const user = useSelector(state => state.user)
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
                    filePath: response.data.filePath,
                    filename: response.data.filename
                }

                setFilePath(response.data.filePath)

                Axios.post('/api/video/thumbnail', variable)
                .then(response => {
                    if(response.data.success) {
                        console.log(response.data)
                        setDuration(response.data.fileDuration)
                        setThumbnailPath(response.data.thumbsFilePath)

                    } else {
                        alert('썸네일 생성 실패')
                    }
                })

            } else {

                console.log("fail ")
                console.log(response.data)
                alert('업로드 실패')
            }
        })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        
        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            file: FilePath,
            catogory: Category,
            duration: Duration,
            thumbnail: ThumbnailPath
        }

        Axios.post('/api/video/uploadVideo', variables)
        .then(response => {
            if(response.data.success) {
                message.success('업로드를 완료했습니다.')
                setTimeout(() => {
                    props.history.push('/')
                }, 3000);

            } else {
                alert('비디오 업로드 실패')
            }
        })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Upload Video</Title>
            </div>
            <Form onSubmit={onSubmit}>
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
                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>

            </Form>
        </div>
    )
}

export default VideoUploadPage
