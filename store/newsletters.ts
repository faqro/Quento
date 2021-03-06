import { Module, VuexModule, MutationAction,Mutation, Action } from 'vuex-module-decorators'

import firestore from '~/plugins/firestore'
import {Newsletter, Newsletter_t_F, Newsletter_t} from '~/types/newsletters'


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

@Module({ stateFactory: true, name: 'newsletters', namespaced: true })
export default class NewslettersModule extends VuexModule {

  newsletterList : Newsletter[] = [];
  sortBy = "createdAt";
  postNewsletterModalOpen = false;


  @Mutation
  public SET_POST_MODAL_OPEN(val : boolean)
  {
    this.postNewsletterModalOpen = val;
  }

  @Mutation
  public SET_NEWSLETTER_LIST(items : Newsletter[])
  {
    this.newsletterList = items;
  }

  @Action({ rawError: true })
  public async GetNewsletters() {
    try {
      const query = await firestore.collection('newsletters').orderBy(this.sortBy).get();
      const items = query.docs.map(doc => Newsletter.fromFirebase(doc.data() as Newsletter_t_F, doc.id));
      this.SET_NEWSLETTER_LIST(items);
      return;
    } catch (error) {
      console.log({ error })
    }
    return; 
  }



}