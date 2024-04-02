import React, { useState, useEffect } from 'react';
import { EditOutlined, DeleteOutlined, UserAddOutlined, WarningTwoTone, StopTwoTone } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { fetchUsers, fetchOneUser, editUser, deleteUser, registration } from '../../http/userAPI'
import { List, Card, Avatar, Typography, Pagination, Modal, Input, Form } from 'antd';
import { Button, notification } from '../../components/common/index';
import './style.scss'
const { Meta } = Card;
const { Title } = Typography;


const UserManagement = () => {
    // Получение данных о текущем пользователе из Redux store
    const usersPerPage = 4;
    const currentUserId = useSelector(state => state.user.user.id);
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
    const [editedUser, setEditedUser] = useState({ login: '', name: '', password: '' }); // Состояние для данных редактируемого пользователя

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

    const handleConfirmDelete = async () => {
        try {
            await deleteUser(selectedUser.id);
            setModalVisible(false);
            // После успешного удаления обновляем список пользователей
            fetchUsersInfo();
            notification({
                type: 'success',
                message: 'Success!',
                description: `User ${selectedUser.login} deleted successfully!`,
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            notification({
                type: 'error',
                message: 'Error!',
                description: `Failed to delete ${selectedUser.login} user!`,
            });
        }
    };

    const handleCancelDelete = () => {
        setModalVisible(false);
    };

    ////////////////////////
    
    const handleEditUser = async (user) => {
        setSelectedUser({ ...user, extracts: [] });
        setEditedUser({ login: user.login, name: user.name, password: '' });
        setIsRegistration(false);
        setEditModalVisible(true);
    };

    const handleRegistration = () => {
        setIsRegistration(true); // Устанавливаем флаг регистрации в true
        setEditedUser({ login: '', name: '', password: '' }); // Очищаем данные редактируемого пользователя
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
            title: 'Внимание!',
            content: `Подтвердите ${isRegistration ? 'регистрацию нового' : 'изменение'} пользователя '${isRegistration ? editedUser.login : selectedUser.login }'`,
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
                        message: 'Success!',
                        description: `User ${isRegistration ? editedUser.login : selectedUser.login } ${isRegistration ? 'registered' : 'edited'} successfully!`,
                    });
                } catch (error) {
                    let errorMessage = 'An error occurred while register';
                    if (error.response && error.response.data && error.response.data.message) {
                      errorMessage = error.response.data.message;
                    } else if (error.message) {
                      errorMessage = error.message;
                    }
                    console.error('Error editing user:', error);
                    notification({
                        type: 'error',
                        message: `Failed to ${isRegistration ? 'register' : 'edit'} ${isRegistration ? editedUser.login : selectedUser.login } user!`,
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
            <Card title='Данные авторизованного пользователя:'>    
                <Meta
                    avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
                    title={<><u style={{color: '#1890ff'}}>Login:</u><span style={{ marginLeft: '20px' }}>{currentUserInfo.login}</span></>}
                    description={<><u style={{color: '#1890ff'}}>Name:</u><span style={{ marginLeft: '20px' }}>{currentUserInfo.name}</span></>}
                />
            </Card>
            <Title>Панель управления пользователями</Title>
            <List
                header={
                    <div className='user-list-header'>
                        <div className='user-list-info'>
                            <p><b>#</b></p>
                            <p style={{width:'9.8rem'}}><b>ID</b></p>
                            <p style={{width:'13rem'}}><b>Login</b></p>
                            <p><b>Name</b></p>
                        </div>
                        <div className='button-container'>
                            <Button icon={<UserAddOutlined />} onClick={handleRegistration}/>
                        </div>
                    </div>
                }
                bordered
                dataSource={users}
                renderItem={(item, index) => (
                    <List.Item>
                        <div className="user-list-info">
                            <p><b>{index + 1}</b></p>
                            <p>{item.id}</p>
                            <p>{item.login}</p>
                            <p>{item.name}</p>
                        </div>
                        <div className="user-list-actions">
                            <Button icon={<EditOutlined />} onClick={() => handleEditUser(item)}/>
                            <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteUser(item)}/>
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
            {/* Модальное окно для подтверждения удаления пользователя */}
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
                        {' '}Удаление пользователя{' '} 
                        <u>{selectedUser ? selectedUser.login : ''}</u>
                    </>
                }
                open={modalVisible}
                onOk={handleConfirmDelete}
                onCancel={handleCancelDelete}
                okButtonProps={{ disabled: selectedUser && selectedUser.extracts.length > 0 }}
            >
                {selectedUser && selectedUser.extracts.length === 0 ? (
                    <p>Вы уверены, что хотите удалить пользователя <b>{selectedUser.login}</b>?</p>
                ) : (
                    <p>Удаление данного пользователя невозможно, так как у него есть выписки <b>({selectedUser ? selectedUser.extracts.length : 0})</b>. Перед удалением пользователя необходимо удалить/изменить данные выписки.</p>
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
                        {' '}{isRegistration ? 'Регистрация нового' : 'Редактирование'} пользователя{' '}
                        <u style={{color:'blue'}}>{selectedUser?.login}</u>
                    </>
                }
                open={editModalVisible}
                onOk={handleEditModalOk}
                onCancel={handleEditModalCancel}
            >
                <Form className='edit-modal-content-container'>
                    <Form.Item label="Login">
                        <Input
                            placeholder="Login"
                            value={editedUser.login}
                            onChange={(e) => setEditedUser({ ...editedUser, login: e.target.value })}
                            style={{ marginBottom: '10px' }}
                        />
                    </Form.Item>
                    <Form.Item label="Name">
                        <Input
                            placeholder="Name"
                            value={editedUser.name}
                            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                            style={{ marginBottom: '10px' }}
                        />
                    </Form.Item>
                    <Form.Item label="Password">
                        <Input.Password
                            placeholder="Password"
                            value={editedUser.password}
                            onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
                            
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
 
export default UserManagement;