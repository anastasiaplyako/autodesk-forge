import React, {useContext} from 'react';
import {MenuOutlined} from '@ant-design/icons';
import './menu.scss';
import {AuthContext} from "../../context/auth.context";

export const Menu = () => {
    const auth = useContext(AuthContext);
    return (
        <div className="menu">
            <li><MenuOutlined/>
                <ul className="submenu">
                    <a href="/folders">
                        Документация
                    </a>
                </ul>
                <ul className="submenu">
                    <a href="/model">
                        Модель
                    </a>
                </ul>
                <ul className="submenu">
                    <a href="/tables">
                        Таблицы
                    </a>
                </ul>
                {auth.role === 'admin' &&
                <>
                    <ul className="submenu">
                        <a href="/editDocumentation">
                            Редактировать документацию
                        </a>
                    </ul>
                    <ul className="submenu">
                        <a href="/folderRole">
                            Назначение ролей
                        </a>
                    </ul>
                    <ul className="submenu">
                        <a href="/roles">
                            Роли
                        </a>
                    </ul>
                    <ul className="submenu">
                        <a href="/usersProject">
                            Пользователи
                        </a>
                    </ul>
                    <ul className="submenu">
                        <a href="/settings">
                            Настройки
                        </a>
                    </ul>
                </>
                }
                {auth.role === 'expert' &&
                <>
                    <ul className="submenu">
                        <a href="/notes">
                            Замечания
                        </a>
                    </ul>
                </>
                }
            </li>

        </div>
    )
}