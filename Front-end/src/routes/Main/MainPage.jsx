import React, { useCallback, useEffect, useRef, useState } from 'react';
import ServiceLayout from '../../layouts/ServiceLayout';
import './MainPage.module.css';
import styles from './MainPage.module.css';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import Post from './components/Post';
import Private from './components/modal/Private';
import Create from './components/modal/Create';
import TabMenu from './components/TabMenu';

/* 더미 데이터 */
const posts = [
  {
    id: 0,
    title: '백준 레벨1 문제 1 문제 풀이 합니다.',
    createAt: new Date('2024-03-01'),
    private: false, // true : 비공개, false : 공개
    privatePassword: '',
    lagnguage: 'javascript',
    maxUser: 5,
    user: {
      id: new Date(),
      name: '홍길동',
      nickname: '제임슨',
      profile: 'img/default_profile.png',
      createAt: '2024-04-12 10:34:23',
      theme: 'light',
      permission: true,
    },
    users: [
      { id: 1, name: '톰', permission: false },
      { id: 2, name: '코딩캣', permission: false },
    ],
  },
  {
    id: 1,
    title: '열정 만수르 프로젝트 코드리뷰 pw:0411',
    createAt: new Date('2024-04-01'),
    private: true,
    privatePassword: '0411',
    lagnguage: 'java',
    maxUser: 4,
    user: {
      id: new Date(),
      name: '홍길동',
      nickname: '코딩맨',
      profile: 'img/default_profile.png',
      createAt: '2024-04-13 10:34:23',
      theme: 'dark',
    },
    users: [],
  },
];

const endPosts = [
  {
    id: 0,
    title: '열정 만수르 프로젝트 코드리뷰 0411',
    createAt: new Date(),
    private: false, // true : 비공개, false : 공개
    privatePassword: '',
    lagnguage: 'javascript',
    maxUser: 5,
    user: {
      id: new Date(),
      name: '홍길동',
      nickname: '톰',
      profile: 'img/default_profile.png',
      createAt: '2024-04-12 10:34:23',
      theme: 'light',
      permission: true,
    },
    users: [
      { id: 1, name: '톰', permission: false },
      { id: 2, name: '코딩캣', permission: false },
    ],
  },
];

export default function MainPage() {
  const [items, setItems] = useState(posts);
  const [tabIndex, setTabIndex] = useState(0);
  const [isMakeOpen, setIsMakeOpen] = useState(false);
  const [isPrivateOpen, setIsPrivateOpen] = useState(false);
  const [privateRoom, setPrivateRoom] = useState({ id: 0, title: '', pw: '' });

  const navigate = useNavigate();

  useEffect(() => {
    if (tabIndex === 1) {
      setItems(endPosts);
    } else {
      setItems(posts);
    }
  }, [tabIndex]);

  const onFilter = useCallback(
    (e) => {
      if (e.target.value === 'new') {
        setItems(
          [...items].sort(function (a, b) {
            return new Date(b.createAt) - new Date(a.createAt);
          }),
        );
      } else {
        setItems(
          [...items].sort(function (a, b) {
            return new Date(a.createAt) - new Date(b.createAt);
          }),
        );
      }
    },
    [items],
  );

  const onClickMakeOpen = useCallback(() => {
    setIsMakeOpen(!isMakeOpen);
  }, [isMakeOpen]);

  // 비공개 비밀번호 모달창 열기
  const onClickPriviateOpen = useCallback(
    (state, id, title, pw) => {
      setPrivateRoom({ id: 0, title: '', pw: '' });

      if (state) {
        setPrivateRoom({ id, title, pw });
        setIsPrivateOpen(!isPrivateOpen);
      } else {
        navigate(`/ide?id=${id}`);
      }
    },
    [isPrivateOpen, navigate],
  );

  const onClickCancel = useCallback(
    (state) => {
      if (state === 'make') setIsMakeOpen(!isMakeOpen);
      else if (state === 'private') setIsPrivateOpen(!isPrivateOpen);
    },
    [isMakeOpen, isPrivateOpen],
  );

  return (
    <ServiceLayout>
      <Helmet>
        <title>codeVIBE - 바이브 IDE</title>
      </Helmet>

      <div className={styles.container}>
        <div className={styles.containerInner}>
          <div className={styles.titleBox}>
            <h2 className={styles.title}>바이브 IDE</h2>
            <button className={styles.makeBtn} onClick={onClickMakeOpen}>
              VIBE IDE 생성
            </button>
          </div>

          <TabMenu tabIndex={tabIndex} setTabIndex={setTabIndex} />

          <div className={styles.infoBox}>
            <h4 className={styles.infoMsg}>
              진행중인 IDE <span>{items.length}개</span>
            </h4>

            <select className={styles.selectBox} onChange={onFilter}>
              <option value="new">최신순</option>
              <option value="old">오래된순</option>
            </select>
          </div>

          {tabIndex === 0 && (
            <>
              {items.length === 0 ? (
                <div className={styles.notPostBox}>
                  <p className={styles.notPostTitle}>생성된 IDE가 없습니다.</p>
                  <span className={styles.notPostMsg}>
                    우측 상단에 ‘VIBE IDE 생성' 버튼을 클릭하여
                    <br />
                    VIBE IDE를 실행해보세요
                  </span>
                </div>
              ) : (
                <>
                  <div className={styles.itemWrapper}>
                    {items.map((data) => {
                      return <Post data={data} key={data.id} onClickPriviateOpen={onClickPriviateOpen} />;
                    })}
                  </div>

                  <div className={styles.pagingBox}>
                    <button type="button" className={`${styles.pagingBtn} ${styles.pagingActive}`}>
                      1
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {tabIndex === 1 && (
            <>
              {items.length === 0 ? (
                <></>
              ) : (
                <>
                  <div className={styles.itemWrapper}>
                    {items.map((data) => {
                      return <Post data={data} key={data.id} onClickPriviateOpen={onClickPriviateOpen} />;
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {isMakeOpen && <Create onClickCancel={onClickCancel} />}
      {isPrivateOpen && <Private privateRoom={privateRoom} onClickCancel={onClickCancel} />}
    </ServiceLayout>
  );
}
