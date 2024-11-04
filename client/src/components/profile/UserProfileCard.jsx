import { Button, Card, Col, List, Popover, Row, Space, Upload } from 'antd'
import { CameraOutlined, EditOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'
import React from 'react'
import Avatar from '../avatar/Avatar'

function UserProfileCard(props) {

    const avatar=props.avatar
    const cover=props.cover

    const handleImageChange = ({ fileList }) => {
        const files = fileList.map(file => file.originFileObj);
        handleChange({ name: 'img', value: files });
        setAvatar(fileList);
    };

    const handleRemove = (file) => {
        setAvatar(prevList => prevList.filter(item => item.uid !== file.uid));
        const updatedImages = values.img.filter(img => img !== file.originFileObj);
        setValues({ ...values, img: updatedImages });
    };
    const avatarActions = () => (
        <List
            size="small">
            <List.Item>
                <Space direction="vertical">
                    <ImgCrop showGrid quality={1} zoomSider={false} cropShape='round' maxZoom={2.5}>
                        <Upload
                            name="avatar"
                            className="avatar-uploader"
                            showUploadList={false}
                            onChange={handleImageChange}
                            onRemove={handleRemove}
                        >
                            <Button icon={<FileImageOutlined />}>Update Avatar</Button>
                        </Upload>
                    </ImgCrop>
                    <Button icon={<PictureOutlined />} onClick={handleAvatarClick}>View Avatar</Button>
                </Space>
            </List.Item>
        </List>
    )
    return (
        <Card
            cover={
                <div style={{ position: 'relative' }}>

                    <Image
                        src={`${cover[0].url}`}
                        style={{ objectFit: 'cover', height: 300, width: '100%' }}
                        preview={false}
                        alt="Cover Photo"
                    />
                    <ImgCrop showGrid quality={1} zoomSider={false} aspect={3 / 1}>
                        <Upload
                            name="cover"
                            className="cover-uploader"
                            showUploadList={false}
                            onChange={handleImageChange}
                            onRemove={handleRemove}
                        >
                            <Button
                                style={{ position: 'absolute', bottom: 16, right: 16 }}
                                icon={<CameraOutlined />}
                            >
                                Edit Cover Photo
                            </Button>
                        </Upload>
                    </ImgCrop>
                </div>
            }
            bordered={false}
        >

            <Row gutter={16} justify="center" align="middle">
                <Col span={6} align="center" style={{ height: "100%", maxHeight: 200 }}>
                    <Popover placement="bottom" title={avatarActions}>
                        <Avatar src={avatar[0]?.url} size={160} icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
                    </Popover>
                </Col>
                <Col xs={24} sm={16} md={18} style={{ height: "100%", minHeight: 200 }}>
                    <Title level={2}>{user.username}</Title>
                    <Row gutter={16} style={{ marginTop: 40 }}>
                        <Col>
                            <Button type="primary" icon={<EditOutlined />}>Edit Profile</Button>
                        </Col>
                        <Col>
                            <Button icon={<SettingOutlined />}>Account Settings</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Tabs defaultActiveKey="1" type="card" style={{ marginTop: 20 }} items={tabs} />
        </Card>
    )
}

export default UserProfileCard