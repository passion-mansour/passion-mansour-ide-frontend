import { useCallback, useRef, useState } from 'react';
import styles from '../../MainPage.module.css';
import { useNavigate } from 'react-router';

const Private = ({ privateRoom, onClickCancel }) => {
  const [privatePassword, setPrivatePassword] = useState('');
  const pwConfirmRef = useRef();

  const navigate = useNavigate();

  const onChangePrivatePassword = useCallback((e) => {
    pwConfirmRef.current.style.borderColor = '#d5d5d5';
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    setPrivatePassword(String(e.target.value));
  }, []);

  const onSubmitPrivate = useCallback(
    (e) => {
      e.preventDefault();

      if (privatePassword === '') {
        pwConfirmRef.current.style.borderColor = '#f00';
        pwConfirmRef.current.focus();
        return false;
      }

      if (privatePassword !== privateRoom.pw) {
        window.alert('올바르지 않는 패스워드 입니다.');
        pwConfirmRef.current.focus();
        return false;
      }

      navigate(`/ide?id=${privateRoom.id}&private=${privateRoom.pw}`);
    },
    [privatePassword, privateRoom, navigate],
  );

  return (
    <div className={styles.modalBox}>
      <div className={styles.makeModal}>
        <h3 className={styles.privatTitle}>{privateRoom.title} - 패스워드</h3>

        <form onSubmit={onSubmitPrivate}>
          <input
            type="text"
            className={styles.inputBox}
            ref={pwConfirmRef}
            value={privatePassword}
            onChange={onChangePrivatePassword}
            maxLength="4"
            placeholder="패스워드 입력 (4글자 숫자만 가능합니다)"
          />

          <div className={styles.btnBox}>
            <button className={styles.cancel} onClick={() => onClickCancel('private')}>
              취소
            </button>
            <button type="submit" className={styles.confirm}>
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Private;