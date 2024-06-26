import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import ServiceLayout from '../../layouts/ServiceLayout';
import styles from './Mypage.module.css';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { useNavigate } from 'react-router';
import ThemeContext from '../../contexts/themeContext';
import api from '../../api/api';
import { getMyUser } from '../../api/serviceApi';

export default function Mypage() {
  const { isDark, setIsDark } = useContext(ThemeContext);
  const [userData, setUserData] = useState({});
  const [isTheme, setIsTheme] = useState('light');
  const [form, setForm] = useState({
    name: '',
    nickname: '',
  });
  const [isState, setIsState] = useState({
    isName: true,
    isNickname: true,
  });
  const [msg, setMsg] = useState({
    name: '',
    nickname: '',
  });

  const navigate = useNavigate();
  const nickRef = useRef();

  useEffect(() => {
    if (isDark) {
      setIsTheme('dark');
    } else {
      setIsTheme('light');
    }

    getMyUser()
      .then((res) => {
        console.log('userData : ', res);
        if (res.status === 200) {
          setUserData(res.data);
          setForm({ name: res.data.name, nickname: res.data.nickName });
        }
      })
      .catch((err) => console.log('err : ', err));
  }, [isDark]);

  const onChangeName = useCallback(
    (e) => {
      const value = e.target.value;
      if (value.length < 2 || value.length > 4) {
        setIsState({ ...isState, isName: false });
        setMsg({ ...msg, name: '최소 2자에서 최대 4자 입니다' });
      } else {
        setIsState({ ...isState, isName: true });
        setMsg({ ...msg, name: '' });
      }
      setForm({ ...form, name: value });
    },
    [form, isState, msg],
  );

  const onChangeNickname = useCallback(
    (e) => {
      const value = e.target.value;
      if (value.length < 2 || value.length > 12) {
        setIsState({ ...isState, isNickname: false });
        setMsg({ ...msg, nickname: '최소 2자에서 최대 12자 입니다' });
      } else {
        setIsState({ ...isState, isNickname: false });
        setMsg({ ...msg, nickname: '중복확인 해주세요' });
      }
      setForm({ ...form, nickname: value });
    },
    [form, isState, msg],
  );

  const onIsNickname = useCallback(() => {
    const value = nickRef.current.value;
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    if (value.length < 2 || value.length > 12) {
      setIsState({ ...isState, isNickname: false });
      setMsg({ ...msg, nickname: '최소 2자에서 최대 12자 입니다' });
    } else {
      axios
        .get(`${baseURL}/members/check-nickname?nickName=${form.nickname}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: false,
        })
        .then((res) => {
          if (res.status === 200) {
            setIsState({ ...isState, isNickname: true });
            setMsg({ ...msg, nickname: '사용가능한 닉네임입니다' });
          }
        })
        .catch((err) => {
          setIsState({ ...isState, isNickname: false });
          setMsg({ ...msg, nickname: '사용중인 닉네임입니다' });
          console.log(err);
        });
    }
  }, [form, isState, msg]);

  const onChangeTheme = useCallback(
    (e) => {
      if (e.target.value === 'dark') {
        setIsDark(true);
        localStorage.setItem('theme', 'dark');
      } else {
        setIsDark(false);
        localStorage.removeItem('theme');
      }
    },
    [setIsDark],
  );

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!isState.isName) {
        window.alert('이름이 올바른 형식이 아닙니다');
      } else if (!isState.isNickname) {
        window.alert('닉네임이 올바른 형식이 아니거나 중복확인 해주세요');
      } else {
        const userInfo = {
          id: userData.id,
          name: form.name,
          nickName: form.nickname,
        };

        console.log('aaaaaaaaa');
        console.log('userInfo : ', userInfo);

        try {
          const res = await api.patch(`/members/update-profile`, userInfo);

          if (res.status === 200) {
            console.log('mypage - res.data', JSON.parse(res.config.data));
            console.log('mypage - userInfo', userInfo);
            console.log('수정 완료');

            window.alert('성공');

            localStorage.setItem('ud', res.config.data);
            navigate('/main');
          }
        } catch (err) {
          window.alert('정보 수정에 실패했습니다');
        }

        console.log('bbbbbbbbb');
      }
    },
    [userData, form, isState, navigate],
  );

  return (
    <ServiceLayout>
      <Helmet>
        <title>codeVIBE - 마이페이지</title>
      </Helmet>

      <div className={styles.container}>
        <form onSubmit={onSubmit} className={styles.formDiv}>
          <div className={styles.profileContainer}>
            <img src={!userData.profile && 'img/default_profile.png'} alt="profile" className={styles.profileImage} />
            <div className={styles.profileDetails}>
              <p className={styles.nameColor}>{userData.name}</p>
              <button style={{ display: 'none' }}>프로필 변경</button>
            </div>
          </div>

          <div className={styles.infoSection}>
            <h4 className={styles.infoTitle}>개인정보 설정</h4>

            <div className={styles.inputBox}>
              <input
                type="text"
                className={styles.inputText}
                value={form.name}
                onChange={onChangeName}
                placeholder="이름"
              />
              {msg.name.length > 0 && (
                <span className={!isState.isName ? styles.errMsg : styles.successMsg}>{msg.name}</span>
              )}
            </div>
            <div className={styles.inputBox}>
              <div className={styles.isChkBox}>
                <input
                  type="text"
                  className={styles.inputText}
                  ref={nickRef}
                  value={form.nickname}
                  onChange={onChangeNickname}
                  placeholder="닉네임"
                />
                <button type="button" className={styles.chkBtn} onClick={onIsNickname}>
                  중복확인
                </button>
              </div>
              {msg.nickname.length > 0 && (
                <span className={!isState.isNickname ? styles.errMsg : styles.successMsg}>{msg.nickname}</span>
              )}
            </div>
            <button type="button" className={styles.btnChk} onClick={() => navigate('/pwChange')}>
              비밀번호 변경
            </button>
          </div>

          <div className={styles.settingsSection}>
            <h4 className={styles.settingsTitle}>기본 설정</h4>
            <select className={styles.inputSelect} onChange={onChangeTheme} value={isTheme}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className={styles.btnBox}>
            <button type="button" className={styles.cancel} onClick={() => navigate('/main')}>
              취소
            </button>
            <button type="submit" className={styles.confirm}>
              수정
            </button>
          </div>
        </form>
      </div>
    </ServiceLayout>
  );
}
