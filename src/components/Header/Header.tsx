import {
  CalendarOutlined,
  FontSizeOutlined,
  SettingOutlined,
  TableOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FirstLogo } from '../../styles/basic-styles';
import { SettingsModalContainer } from '../SettingsModal/SettingsModal.container';
import { HeaderProps } from './Header.model';
import './Header.scss';

export const Header: FC<HeaderProps> = React.memo(
  ({
    isMentorStatus,
    changeMentorStatus,
    isShowSettingsModal,
    setShowModalSetting,
    types,
    setColorType,
    isShowVersionVisually,
    setChangeVersionVisually,
  }) => {
    const history = useHistory();

    const [colorDeadline, setColorDeadline] = useState<string>('#FF69B4');
    const [colorTask, setColorTask] = useState<string>('#00FF56');

    /** этот хук дает первоначальную отрисовку типов с цветами из локалстораджа */
    useEffect(() => {
      if (JSON.parse(localStorage.getItem('colorDeadline')!)) {
        setColorDeadline(JSON.parse(localStorage.getItem('colorDeadline')!));
      }
      if (JSON.parse(localStorage.getItem('colorTask')!)) {
        setColorTask(JSON.parse(localStorage.getItem('colorTask')!));
      }
      const newColorDeadline = types.filter((i) => i.type === 'deadline').map((i) => ({ ...i, color: colorDeadline }));
      const filteredType = types.filter((i) => i.type !== 'deadline' && !i.type.includes('task'));
      const newColorTask = types.filter((i) => i.type.includes('task')).map((i) => ({ ...i, color: colorTask }));

      setColorType([...filteredType, ...newColorDeadline, ...newColorTask]);
      //eslint-disable-next-line
    }, [colorDeadline, colorTask]);

    const handleShowTable = useCallback(() => {
      history.push('/');
    }, [history]);

    const handleShowCalendar = useCallback(() => {
      history.push('/calendar');
    }, [history]);

    const handleShowList = useCallback(() => {
      history.push('/list');
    }, [history]);

    if (JSON.parse(localStorage.getItem('DARK_MODE') || '{}') === true) {
      document.body.classList.add('dark-mode');
    }
    console.log(isShowVersionVisually);
    return (
      <>
        <div className="header">
          <FirstLogo />
          <div className="calendar-title"></div>
          <div className="btn-header">
            <Button onClick={setChangeVersionVisually} icon={<FontSizeOutlined />}>
              version for the visually impaired
            </Button>
            <Button onClick={() => setShowModalSetting(true)}>
              <SettingOutlined />
            </Button>
            <Button onClick={handleShowTable}>
              <TableOutlined />
            </Button>
            <Button onClick={handleShowCalendar}>
              <CalendarOutlined />
            </Button>
            <Button onClick={handleShowList}>
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
