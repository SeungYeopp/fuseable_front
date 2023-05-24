import { atom } from "recoil";


const kanbanListState = atom({
  key: 'kanbanListState',
  default: [],
});

const projectListState = atom({
  key: 'projectListState',
  default: [],
})

const noticeListState = atom({
  key: 'noticeListState',
  default: [],
})

const myDocumentState = atom({
  key: 'myDocumentState',
  default: [],
})

const userInProjectState = atom({
  key: 'userInProject',
  default: [],
})

export {kanbanListState, projectListState, noticeListState, myDocumentState, userInProjectState};