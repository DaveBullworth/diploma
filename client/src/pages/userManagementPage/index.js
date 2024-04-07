import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    EditOutlined, UserAddOutlined, 
    WarningTwoTone, StopTwoTone,
    StopOutlined, UserOutlined, 
    CrownTwoTone, CloseOutlined,
    CheckOutlined, CrownOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { fetchUsers, fetchOneUser, editUser, deleteUser, registration } from '../../http/userAPI'
import { List, Card, Avatar, Typography, Pagination, Modal, Input, Form, Checkbox } from 'antd';
import { Button, notification } from '../../components/common/index';
import './style.scss'
const { Meta } = Card;
const { Title } = Typography;


const UserManagement = () => {
    const { t } = useTranslation();
    // Получение данных о текущем пользователе из Redux store
    const usersPerPage = 4;
    const currentUserId = useSelector(state => state.user.user.id);
    const isAdmin = useSelector(state => state.user.user.admin);
    const [currentUserInfo, setCurrentUserInfo] = useState({})
    const fetchCurrentUserInfo = async () => {
        try {
            const response = await fetchOneUser(currentUserId);
            setCurrentUserInfo(response)
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }
    useEffect(() => {
        fetchCurrentUserInfo();
    }, []);

    // Состояние для списка пользователей с сервера
    const [users, setUsers] = useState([]);
    
    // Состояние для текущей страницы
    const [currentPage, setCurrentPage] = useState(1);

    // Состояние для количества пользователей всего
    const [usersCount, setUserCount] = useState(null);

    const [selectedUser, setSelectedUser] = useState(null); // Состояние для выбранного пользователя перед удалением
    const [modalVisible, setModalVisible] = useState(false); // Состояние для отображения модального окна

    const [editModalVisible, setEditModalVisible] = useState(false); // Состояние для отображения модального окна редактирования
    const [editedUser, setEditedUser] = useState({ login: '', name: '', password: '', active: false, admin: false }); // Состояние для данных редактируемого пользователя

    const [isRegistration, setIsRegistration] = useState(false);

    useEffect(() => {
        fetchUsersInfo();
    }, [currentPage]);

    // Функция для загрузки пользователей с сервера
    const fetchUsersInfo = async () => {
        // количество пользователей на 1 странице
        try {
            // Вычисляем индекс первого пользователя на текущей странице
            const indexOfLastUser = currentPage * usersPerPage;
            // Вычисляем индекс первого пользователя на предыдущей странице
            const indexOfFirstUser = indexOfLastUser - usersPerPage;
            
            // Получаем список пользователей с сервера
            const response = await fetchUsers();
            setUserCount(response.length)
            // Отображаем только пользователей на текущей странице
            setUsers(response.slice(indexOfFirstUser, indexOfLastUser));
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Функция для переключения страницы
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDeleteUser = async (user) => {
        // Запрос на получение информации о пользователе перед удалением
        try {
            const userData = await fetchOneUser(user.id);
            setSelectedUser(userData);
            setModalVisible(true);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleConfirmDelete = async (flag) => {
        try {
            if (flag) {
                await deleteUser(selectedUser.id);
            } else {
                await editUser(selectedUser.id, { active: false });
            }
            setModalVisible(false);
            // После успешного удаления обновляем список пользователей
            fetchUsersInfo();
            notification({
                type: 'success',
                message: t("modal.success"),
                description: `${t("table-columns.user")} ${selectedUser.login} ${t("notification.successDesc3")}!`,
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            notification({
                type: 'error',
                message: t("modal.error"),
                description: `${t("notification.errorDesc5")} ${selectedUser.login} ${t("userManagment.user")}!`,
            });
        }
    };

    const handleCancelDelete = () => {
        setModalVisible(false);
    };

    ////////////////////////
    
    const handleEditUser = async (user) => {
        setSelectedUser({ ...user, extracts: [] });
        setEditedUser({ login: user.login, name: user.name, password: '', active: user.active, admin: user.admin });
        setIsRegistration(false);
        setEditModalVisible(true);
    };

    const handleRegistration = () => {
        setIsRegistration(true); // Устанавливаем флаг регистрации в true
        setEditedUser({ login: '', name: '', password: '', active: true, admin: false }); // Очищаем данные редактируемого пользователя
        setEditModalVisible(true); // Показываем модальное окно
    };

    const handleEditModalOk = async () => {
        setEditModalVisible(false);
        // Проверяем, является ли поле password пустой строкой
        const isPasswordEmpty = editedUser.password.trim() === '';
        // Если поле password пустое и регистрация нового пользователя, выходим из функции
        if (isPasswordEmpty && isRegistration) return;
        // Если поле password пустое, удаляем его из объекта editedUser
        const editedUserData = isPasswordEmpty ? { ...editedUser, password: undefined } : editedUser;
        const confirmEdit = Modal.confirm({
            title: t("modal.attention"),
            content: `${t("modal.confirm_")} ${isRegistration ? t("modal.regNew") : t("modal.edition")} ${t("modal.user")} '${isRegistration ? editedUser.login : selectedUser.login }'`,
            onOk: async () => {
                try {
                    if (isRegistration) {
                        await registration(editedUserData);
                    } else {
                        await editUser(selectedUser.id, editedUserData);
                        
                    }
                    fetchUsersInfo();
                    notification({
                        type: 'success',
                        message: t("modal.success"),
                        description: `${t("modal.user_")} ${isRegistration ? editedUser.login : selectedUser.login } ${isRegistration ? t("modal.reged") : t("modal.edited")} ${t("notification.success_")}!`,
                    });
                } catch (error) {
                    let errorMessage = t("notification.errorDesc9");
                    if (error.response && error.response.data && error.response.data.message) {
                      errorMessage = error.response.data.message;
                    } else if (error.message) {
                      errorMessage = error.message;
                    }
                    console.error('Error editing user:', error);
                    notification({
                        type: 'error',
                        message: `${t("notification.errorDesc10")} ${isRegistration ? t("notification.reg") : t("notification.edit")} ${isRegistration ? editedUser.login : selectedUser.login } ${t("modal.user")}!`,
                        description: errorMessage
                    });
                }
            },
            onCancel: () => {
                confirmEdit.destroy();
            },
        });
    };

    const handleEditModalCancel = () => {
        setEditModalVisible(false);
    };

    return ( 
        <div>
            {/* Данные о текущем пользователе */}
            <Card 
                title={t("userManagment.title1") + ':'}
            >    
                <Meta
                    avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                                        title={
                        <div className='user-info-card-meta-block-container'>
                            <div>
                                <u style={{color: '#1890ff'}}>{t("userManagment.login")}:</u>
                                <span style={{marginLeft:'20px'}}>{currentUserInfo.login}</span>
                            </div>
                            <div className='right-allight'>
                                <u style={{color: '#1890ff', marginRight:'38px'}}>ID:</u>
                                <span style={{marginRight:'28px'}}>{currentUserInfo.id}</span>
                            </div>
                        </div>
                    }
                    description={
                        <div className='user-info-card-meta-block-container'>
                            <div>
                                <u style={{color: '#1890ff'}}>{t("table-columns.name")}:</u>
                                <span style={{marginLeft:'20px'}}>{currentUserInfo.name}</span>
                            </div>
                            <div className='right-allight'>
                                <u style={{color: '#1890ff', marginRight:'30px'}}>
                                    {currentUserInfo.admin ? `${t("userManagment.admin")}:` : `${t("modal.user_")}:`}
                                </u>
                                <span style={{marginRight:'20px'}}>
                                    {currentUserInfo.admin ?
                                        <CrownTwoTone twoToneColor="#FFD700" style={{fontSize: '22px'}} /> :
                                        <UserOutlined style={{fontSize: '22px'}}/>
                                    }
                                </span>
                            </div>
                        </div>
                    }
                />
            </Card>
            <Title>{t("userManagment.title2")}</Title>
            <List
                header={
                    <div className='user-list-header'>
                        <div className='user-list-info'>
                            <p style={{width:'7rem'}}><b>#</b></p>
                            <p style={{width:'8rem', fontSize:'inherit'}}><b>{t("userManagment.active")}</b></p>
                            <p style={{width:'9.8rem', fontSize:'inherit'}}><b>{t("userManagment.admin")}</b></p>
                            <p style={{width:'13rem'}}><b>{t("userManagment.login")}</b></p>
                            <p><b>{t("userManagment.name")}</b></p>
                        </div>
                        <div className={isAdmin?'button-container':'span-container'}>
                            {isAdmin ? (
                                <Button icon={<UserAddOutlined />} onClick={handleRegistration}/>
                            ):(
                                <span>{t("userManagment.right")}</span>
                            )}
                        </div>
                    </div>
                }
                bordered
                dataSource={users}
                renderItem={(item, index) => (
                    <List.Item 
                        className={`
                            ${!item.active ? 'inactive-user' : ''} 
                            ${item.admin ? 'admin-user' : ''}
                        `}
                    >
                        <div className="user-list-info">
                            <p><b>{index + 1}</b></p>
                            <p>{item.active ? <CheckOutlined /> : <CloseOutlined />}</p>
                            <p>{item.admin ? <CrownOutlined /> : <UserOutlined />}</p>
                            <p>{item.login}</p>
                            <p>{item.name}</p>
                        </div>
                        <div className="user-list-actions">
                            {isAdmin && (
                                <>
                                    <Button icon={<EditOutlined />} onClick={() => handleEditUser(item)}/>
                                    <Button danger icon={<StopOutlined />} onClick={() => handleDeleteUser(item)}/>
                                </>
                            )}
                        </div>
                    </List.Item>
                )}
            />
            <Pagination 
                current={currentPage} // Указываем текущую страницу
                total={usersCount} // Указываем общее количество пользователей
                pageSize={usersPerPage} // Указываем количество пользователей на странице
                onChange={handlePageChange} // Обработчик изменения страницы
                style={{marginTop: '20px', textAlign: 'center'}} // Дополнительные стили
                hideOnSinglePage
            />
            <Modal
                title={
                    <>
                    {(selectedUser?.extracts.length === 0 ? (
                        <WarningTwoTone 
                            twoToneColor="orange" 
                            style={{fontSize:'20px'}}
                        />
                    ) : (
                        <StopTwoTone 
                            twoToneColor="red" 
                            style={{fontSize:'20px'}}
                        />
                    ))}
                        {' '}{t("userManagment.delUser")}{' '} 
                        <u>{selectedUser ? selectedUser.login : ''}</u>
                    </>
                }
                open={modalVisible}
                onCancel={handleCancelDelete}
                footer={[
                    selectedUser && selectedUser.extracts.length === 0 ? (
                        <>
                            <Button 
                                key="delete" 
                                danger 
                                onClick={() => handleConfirmDelete(true)} 
                                text={t("userManagment.del")}
                            />
                            <Button 
                                key="deactivate" 
                                danger 
                                type="default" 
                                onClick={() => handleConfirmDelete(false)} 
                                text={t("userManagment.deactivate")}
                            />
                        </>
                    ) : (
                        <Button 
                            key="deactivate" 
                            type="primary" 
                            onClick={() => handleConfirmDelete(false)} 
                            text={t("userManagment.deactivate")}
                        />
                    ),
                    <Button key="cancel" onClick={handleCancelDelete} text={t("userManagment.cancel")}/>
                ]}
            >
                {selectedUser && selectedUser.extracts.length === 0 ? (
                    <p>
                        {t("userManagment.delUserConf1")} <b>{selectedUser.login}</b>?
                        {t("userManagment.delUserConf2")}
                    </p>
                ) : (
                    <p>
                        {t("userManagment.delUserConf3")}
                        <b>({selectedUser ? selectedUser.extracts.length : 0})</b>
                        {t("userManagment.delUserConf4")}
                    </p>
                )}
            </Modal>
            {/* Модальное окно для редактирования/регистрации пользователя */}
            <Modal
                title={
                    <>                        
                        <WarningTwoTone 
                            twoToneColor="orange" 
                            style={{fontSize:'20px'}}
                        />
                        {' '}{isRegistration ? t("userManagment.regNem") : t("userManagment.edit")} {t("userManagment.user_")}{' '}
                        <u style={{color:'blue'}}>{selectedUser?.login}</u>
                    </>
                }
                open={editModalVisible}
                onOk={handleEditModalOk}
                onCancel={handleEditModalCancel}
            >
                <Form className='edit-modal-content-container'>
                    <Form.Item label={t("userManagment.login")}>
                        <Input
                            placeholder={t("userManagment.login")}
                            value={editedUser.login}
                            onChange={(e) => setEditedUser({ ...editedUser, login: e.target.value })}
                            style={{ marginBottom: '10px' }}
                        />
                    </Form.Item>
                    <Form.Item label={t("userManagment.name")}>
                        <Input
                            placeholder={t("userManagment.name")}
                            value={editedUser.name}
                            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                            style={{ marginBottom: '10px' }}
                        />
                    </Form.Item>
                    <Form.Item label={t("userManagment.password")}>
                        <Input.Password
                            placeholder={t("userManagment.password")}
                            value={editedUser.password}
                            onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
                            
                        />
                    </Form.Item>
                    <Form.Item label={t("userManagment.active")}>
                        <Checkbox
                            checked={editedUser.active}
                            onChange={(e) => setEditedUser({ ...editedUser, active: e.target.checked })}
                        >
                            {t("userManagment.active")}
                        </Checkbox>
                    </Form.Item>
                    <Form.Item label={t("userManagment.admin")}>
                        <Checkbox
                            checked={editedUser.admin}
                            onChange={(e) => setEditedUser({ ...editedUser, admin: e.target.checked })}
                        >
                            {t("userManagment.admin")}
                        </Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
 
export default UserManagement;