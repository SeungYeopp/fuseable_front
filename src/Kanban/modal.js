import React, { useState } from 'react';
import './modal.css'


const Modal = (props) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close, header } = props;

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? 'openModal modal' : 'modal'}>
      {open ? (
        <section>
          <header>
            {header}
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>
          <main>{props.children}</main>
          <footer>
            <button className="close" onClick={close}>
              close
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

function App2() {
  // useState를 사용하여 open상태를 변경한다. (open일때 true로 만들어 열리는 방식)
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <React.Fragment>
      <button onClick={openModal}>모달팝업</button>
      {/* header 부분에 텍스트를 입력한다. */}
      <Modal open={modalOpen} close={closeModal} header="Modal heading">
        {/* // Modal.js <main> {props.children} </main>에 내용이 입력된다. 리액트 함수형 모달 */}
        팝업창입니다. 쉽게 만들 수 있어요. 같이 만들어봐요!
      </Modal>
    </React.Fragment>
  );
}

export default App2;