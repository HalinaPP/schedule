import { CalendarOutlined, SettingOutlined, TableOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { FC, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { FirstLogo } from '../../styles/basic-styles';
import { SettingsModalContainer } from '../SettingsModal/SettingsModal.container';
import { HeaderProps } from './Header.model';
import './Header.scss';

export const Header: FC<HeaderProps> = React.memo(
  ({ isMentorStatus, changeMentorStatus, isShowSettingsModal, setShowModalSetting }) => {
    const history = useHistory();

    const handleShowTable = useCallback(() => {
      history.push('/');
    }, [history]);

    const handleShowCalendar = useCallback(() => {
      history.push('/calendar');
    }, [history]);

    return (
      <>
        <div className="header">
          <FirstLogo />
          <div className="calendar-title"></div>
          <div className="btn-header">
            <Button onClick={() => setShowModalSetting(true)}>
              <SettingOutlined />
            </Button>
            <Button onClick={handleShowTable}>
              <TableOutlined />
            </Button>
            <Button onClick={handleShowCalendar}>
              <CalendarOutlined />
            </Button>
            <Button>
              <UnorderedListOutlined />
            </Button>
            <Button onClick={changeMentorStatus}>{isMentorStatus ? 'To Student App' : 'To Mentor App'}</Button>
          </div>
        </div>
        {isShowSettingsModal && <SettingsModalContainer />}
      </>
    );
  }
);
