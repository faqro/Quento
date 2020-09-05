import { Module, VuexModule, MutationAction,Mutation, Action } from 'vuex-module-decorators'

import firestore from '~/plugins/firestore'
import { firestore as store } from 'firebase/app'
import {Group, Group_t_F, Group_t} from '~/types/groups'
import { School_O } from '~/types/schools'



import {
  Grade_O,
  SubjectList,
  Subject_O,
  SortOptions_O
} from '~/types/subjects'
export interface FilterOptions {
  filterSubjects: Subject_O[]
  filterGrades: Grade_O
  sortSelect: SortOptions_O
}

let LastVisible: store.QueryDocumentSnapshot<store.DocumentData> | null = null

@Module({ stateFactory: true, name: 'groups', namespaced: true })
export default class GroupsModule extends VuexModule {
  openGroupsModal = false
  addGroup: Group | null = null
  groupList: Group[] = [];
  sortBy = "createdAt";
  ItemsPerPage = 10;
  EndOfList = false;

  ActiveGrade: Grade_O = 'ALL'
  ActiveSchool: School_O | 'All Schools' = 'All Schools'
  ActiveSubjects: Subject_O[] = []
  SortSelect: SortOptions_O = 'createdAt'


  @Mutation
  public SET_GROUP_LIST(items: Group[])
  {
    this.groupList = items;
  }


  @Action({ rawError: true })
  public async GetMoreGroups(start = false) {
    if (this.EndOfList) {
      return
    }
    if (start && this.ItemsPerPage <= this.groupList.length) return
    // If you are just trying to get the first notes and note trying to load more, dont load more than you need to
    
    let query: store.Query<store.DocumentData> = firestore.collection('groups')
    // Do query filtering things

    if (!(this.ActiveGrade === 'ALL')) {
      query = query.where('grade', '==', this.ActiveGrade)
    }
    if (this.ActiveSchool !== 'All Schools') {
      query = query.where('school', '==', this.ActiveSchool)
    }
    if (this.ActiveSubjects.length != 0) {
      query = query.where('subject', 'in', this.ActiveSubjects.slice(0, 10))
    }

    query = query.orderBy(this.SortSelect, 'desc')

    if (LastVisible) {
      query = query.startAfter(LastVisible)
    }

    query = query.limit(this.ItemsPerPage)
    try {
      const snapshot = await query.get()
      const groups = snapshot.docs.map((doc) =>
        Group.fromFirebase(doc.data() as Group_t_F, doc.id)
      )
      LastVisible = snapshot.docs[snapshot.docs.length - 1]
      // this.SET_LAST_VISIBLE(lastVisible);
      this.PUSH_GROUPS(groups)
    } catch (error) {
      console.log({ error })
      throw error
    }
  }

  @Mutation
  private PUSH_GROUPS(groups: Group[]) {
    if (groups.length < this.ItemsPerPage) {
      this.EndOfList = true
    }
    this.groupList.push(...groups)
  }



  @Action({ rawError: true })
  public async createGroup(group: Group ) {
    const newGroup : Group = Object.assign({}, group)
    if(group.id)
    {
      return await firestore.collection('groups').doc(group.id).update(Group.toFirebase(newGroup));
    }
    await firestore.collection('groups').add(Group.toFirebase(newGroup));
  }
  @Mutation
  private SET_ADD_GROUP(val: Group | null) {
    this.addGroup = val
  }

  @Action({ rawError: true })
  public SetAddGroup(val: Group | null) {
    this.SET_ADD_GROUP(val)
  }
  @Mutation
  private TOGGLE_GROUPS_MODULE(val: boolean) {
    this.openGroupsModal = val
  }

  @Action({ rawError: true })
  public ToggleGroupsModule(val: boolean) {
    this.TOGGLE_GROUPS_MODULE(val)
  }

}