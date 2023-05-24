import React, { useState } from "react";


const MyDocumentList = ({order, item}) => {

  const [modalOpen, setModalOpen] = useState(false);


  const Modal = (props) => {
    const { open, close, header, item } = props;
  
    console.log(item);
  
    return (
      <div className={open ? 'openedModal' : 'modal'}>
        {open ? (
          <section>
            <div>
              {header}
              <button className="close" onClick={close}>
                &times;
              </button>
            </div>
            <main>
              {props.children}
              <ul>
                <li>
                  <div
                    className="Input_title"
                    placeholder='Title'
                  >
                    {item.title}
                  </div>
                </li>
                <li>
                  <div
                    className="Input_content"
                    type="text"
                    placeholder='Content'
                  >
                    {item.content}
                  </div>
                </li>
                <li>
                  <div 
                    type="text"
                    className="Input_deadline"
                  >
                    {item.deadline}
                  </div>
                </li>
              </ul>
            </main>
            <footer>
              <button className="close" onClick={close}>
                close
              </button>
            </footer>
          </section>
        ) : null}
      </div>
    )
  }

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  
  return (
    <React.Fragment key={item.id}>
      <div>
        <Modal open={modalOpen} close={closeModal} header="My Document" item={item}></Modal> 
        <span className='myDocumentList'>{order}. </span>
        <span className='myDocumentList' onClick={openModal} >
          {item.title}
        </span>
      </div>
  </React.Fragment>
  )
  
}

export default MyDocumentList;