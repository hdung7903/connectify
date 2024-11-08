import React, { useState } from 'react';
import { Modal, Row, Col, Image, Space, Typography, Divider, Button, Card, Popover } from 'antd';
import { CloseCircleOutlined, GlobalOutlined, LeftOutlined, LockOutlined, RightOutlined, ShareAltOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import './slideshow.css';
import Avatar from '../avatar/Avatar';
import CommentButton from '../interact/CommentButton';
import Reaction from '../interact/Reaction';

const { Text, Title, Paragraph } = Typography;
export default function Slideshow(props) {
    const [idx, setIdx] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expanded, setExpanded] = useState(true);

    const handleImageClick = (index) => {
        setIdx(index);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const numImages = props.images.length;

    const shouldShowContent = (content) => {
        return content !== null && content !== "";
    };

    const handlePrevious = (e) => {
        e.stopPropagation();
        setIdx((prevIdx) => (prevIdx > 0 ? prevIdx - 1 : props.images.length - 1));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setIdx((prevIdx) => (prevIdx < numImages - 1 ? prevIdx + 1 : 0));
    };

    const visibilityIcon = (visibility) => {
        switch (visibility) {
            case 'public':
                return <GlobalOutlined />;
            case 'friends':
                return <UsergroupAddOutlined />;
            case 'private':
                return <LockOutlined />;
            default:
                return null;
        }
    }

    const renderImageGrid = () => {
        const imagesToShow = numImages >= 5 ? 5 : numImages;

        switch (numImages) {
            case 1:
                return (
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Image
                                src={props.images[0].url}
                                alt="Image 1"
                                style={{ cursor: 'pointer' }}
                                width="100%"
                                height={400}
                                onClick={() => handleImageClick(0)}
                                preview={false}
                            />
                        </Col>
                    </Row>
                );

            case 2:
                return (
                    <Row gutter={[16, 16]}>
                        {props.images.map((image, index) => (
                            <Col span={12} key={index}>
                                <Image
                                    src={image.url}
                                    alt={`Image ${index + 1}`}
                                    style={{ cursor: 'pointer' }}
                                    width="100%"
                                    height={300}
                                    onClick={() => handleImageClick(index)}
                                    preview={false}
                                />
                            </Col>
                        ))}
                    </Row>
                );

            case 3:
                return (
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Image
                                src={props.images[0].url}
                                alt="Image 1"
                                style={{ cursor: 'pointer' }}
                                width="100%"
                                height={300}
                                onClick={() => handleImageClick(0)}
                                preview={false}
                            />
                        </Col>
                        {props.images.slice(1).map((image, index) => (
                            <Col span={12} key={index + 1}>
                                <Image
                                    src={image.url}
                                    alt={`Image ${index + 2}`}
                                    style={{ cursor: 'pointer' }}
                                    width="100%"
                                    height={200}
                                    onClick={() => handleImageClick(index + 1)}
                                    preview={false}
                                />
                            </Col>
                        ))}
                    </Row>
                );

            case 4:
                return (
                    <Row gutter={[16, 16]}>
                        {props.images.map((image, index) => (
                            <Col span={12} key={index}>
                                <Image
                                    src={image.url}
                                    alt={`Image ${index + 1}`}
                                    style={{ cursor: 'pointer' }}
                                    width="100%"
                                    height={250}
                                    onClick={() => handleImageClick(index)}
                                    preview={false}
                                />
                            </Col>
                        ))}
                    </Row>
                );

            default: // 5 or more images
                return (
                    <Row gutter={[16, 16]}>
                        {props.images.slice(0, 2).map((image, index) => (
                            <Col span={12} key={index}>
                                <Image
                                    src={image.url}
                                    alt={`Image ${index + 1}`}
                                    style={{ cursor: 'pointer' }}
                                    width="100%"
                                    height={300}
                                    onClick={() => handleImageClick(index)}
                                    preview={false}
                                />
                            </Col>
                        ))}
                        {props.images.slice(2, 5).map((image, index) => (
                            <Col span={8} key={index + 2} style={{ position: 'relative' }}>
                                <Image
                                    src={image.url}
                                    alt={`Image ${index + 3}`}
                                    style={{ cursor: 'pointer' }}
                                    width="100%"
                                    height={200}
                                    onClick={() => handleImageClick(index + 2)}
                                    preview={false}
                                />
                                {index === 2 && numImages > 5 && (
                                    <div
                                        className="overlay"
                                        onClick={() => handleImageClick(index + 2)}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '24px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        +{numImages - 5}
                                    </div>
                                )}
                            </Col>
                        ))}
                    </Row>
                );
        }
    };
    return (
        <>

            {renderImageGrid()}

            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="100%"
                style={{
                    maxWidth: '100vw',
                    margin: 0,
                    padding: 0,
                    top: 0,
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.95)'
                }}
                closeIcon={
                    <CloseCircleOutlined
                        style={{
                            color: 'black',
                            fontSize: '24px',
                            position: 'absolute',
                            top: '20px',
                            right: '30px',
                        }}
                    />
                }
                className="image-modal"
                centered
            >
                <div
                    className="modal-content"
                    style={{
                        display: 'flex',
                        height: '100vh',
                        position: 'relative',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >

                    {numImages > 1 && (
                        <>
                            <div className="nav-button prev" onClick={handlePrevious} style={{
                                position: 'absolute',
                                left: '5%',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                padding: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000
                            }}>
                                <LeftOutlined style={{ color: 'white', fontSize: '24px' }} />
                            </div>
                            <div className="nav-button next" onClick={handleNext} style={{
                                position: 'absolute',
                                right: '35%',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                padding: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000
                            }}>
                                <RightOutlined style={{ color: 'white', fontSize: '24px' }} />
                            </div>
                        </>
                    )}

                    <div style={{
                        display: 'flex',
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px'
                    }}>
                        <div style={{
                            flex: '1 1 70%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%'
                        }}>
                            <Image
                                src={props.images[idx].url}
                                alt={`Image ${idx}`}
                                preview={false}
                                style={{
                                    maxHeight: '90vh',
                                    objectFit: 'contain'
                                }}
                            />
                        </div>

                        <div style={{
                            flex: '1 1 30%',
                            width: '100%',
                            minWidth: '30%',
                            padding: '20px',
                            backgroundColor: '#fff',
                            height: '100%',
                            overflowY: 'auto',
                        }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Card
                                    bordered={false}
                                    title={
                                        <Space>
                                            <Avatar imgId={props?.post?.avatarUrl} />
                                            <Space direction='vertical'>
                                                <Title level={4}>{props?.post?.username}</Title>
                                                <Space size="small" style={{ marginTop: 0 }}>
                                                    <Text type="secondary">{props?.post?.parseDateTime}</Text>&nbsp;
                                                    {visibilityIcon(props?.post?.visibility)}
                                                </Space>
                                            </Space>
                                        </Space>
                                    }
                                    extra={
                                        <Popover content={
                                            <Space direction="vertical">
                                                <Button type="text">Edit Content</Button>
                                                <Button type="text">Delete Image</Button>
                                            </Space>
                                        }
                                            trigger="click"
                                        >
                                            <Button>•••</Button>
                                        </Popover>
                                    }
                                >
                                    {shouldShowContent(props.images[idx].content) && (
                                        <>
                                            <Paragraph
                                                ellipsis={{ rows: expanded ? 2 : undefined, expandable: false }}
                                            >
                                                {props.images[idx].content}
                                            </Paragraph>
                                            {props.images[idx].content?.length > 100 && (
                                                <Text
                                                    type="secondary"
                                                    style={{ cursor: 'pointer', color: '#1890ff' }}
                                                    onClick={() => setExpanded(!expanded)}
                                                >
                                                    {expanded ? 'Show more' : 'Show less'}
                                                </Text>
                                            )}
                                        </>
                                    )}
                                    <Divider style={{ width: '100%', margin: '3px 0' }} />
                                    <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                                        <Reaction />
                                        <Button className="comment-button" type="text">
                                            <CommentButton>Comment</CommentButton>
                                        </Button>
                                        <Button className="share-button" type="text">
                                            <ShareAltOutlined />
                                            Share
                                        </Button>
                                    </Space>
                                    <Divider style={{ width: '100%', margin: '3px 0' }} />
                                </Card>
                            </Space>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
