<template>
  <div id="home-page">
    <SuggestionModal v-model="active" />

    <vs-row justify="center">
      <vs-col class="vx-col w-full">
        <VxCard class="text-center greet-user p-8" content-color="black">
          <template slot="no-body">
            <div class="vx-row justify-center px-8">
              <h1 class="mb-12 text-title text-5xl mr-2">Suggestions</h1>&nbsp; &nbsp;
            </div>
            <div class="vx-row w-full justify-around">
              <div>
                <vs-select color="#7d33ff" label="Sort By" v-model="sortBy">
                  <vs-option
                    :label="item.label"
                    :value="item.value"
                    v-for="(item, index) in sortByOptions"
                    :key="index"
                  >{{ item.label }}</vs-option>
                </vs-select>
              </div>
              <vs-button
                size="xl"
                type="filled"
                color="#9f7aea"
                class="vx-col shadow-md ml-4 text-bold float-right"
                style="font-weight: bold;"
                @click="active = !active"
              >
                Post Suggestion &nbsp;
                <i class="bx bx-highlight text-2xl" />
              </vs-button>
            </div>
            <div class="vx-row md:px-8">
              <div
                class="vx-col md:w-1/2 w-full my-4"
                v-for="(item, index) in Suggestions"
                :key="index"
              >
                <VxCard fitContent="true" class="h-full">
                  <template #actions class="w-full">
                    <div class="vx-row w-full justify-between">
                      <div class="w-3/4 vx-col truncate overflow-hidden">
                        <h4
                          class="text-title truncate"
                          style="font-size: 1.5rem; min-width: 0;"
                        >{{ item.title }}</h4>
                        <h6 class="truncated mt-2">Posted {{ parseDate(item.createdAt.seconds) }}</h6>
                      </div>

                      <VxTooltip class="float-right">
                        <vs-avatar>{{trimText(item.userDisplayName)}}</vs-avatar>
                        <template #tooltip>{{ item.userDisplayName }}</template>
                      </VxTooltip>
                    </div>
                  </template>
                  <div>
                    <div
                      class="vx-row text-base p-4 justify-start"
                      style="min-height: 100px; text-align: left;"
                    >
                      <div class="shadow-md p-2 w-full rounded-md">{{ item.contents }}</div>
                    </div>

                    <div class="float-right my-4" style="border: 0;">
                      <vs-avatar
                        :color="userLiked(item.id) ? 'danger' : '#f4f7f8'"
                        badge-color="#7d33ff"
                        @click="toggleLike(item.id, item.createdAt)"
                      >
                        <i
                          class="bx bx-heart primary"
                          :style="`color : ${
                            userLiked(item.id) ? 'white' : '#ff4757'
                          }`"
                        ></i>
                        <template #badge>{{ item.upVotes }}</template>
                      </vs-avatar>
                    </div>
                  </div>
                </VxCard>
              </div>
              <div class="vx-col w-full"></div>
            </div>
          </template>
        </VxCard>
      </vs-col>
    </vs-row>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Watch, mixins } from 'nuxt-property-decorator'

import { windowStore, authStore, suggestionsStore } from '~/store'
import VsTextarea from '~/components/VsTextarea.vue'

import SuggestionModal from '~/screens/SuggestionModal.vue'
import LoadScroll from '~/mixins/LoadScrollMixin'

@Component<SuggestionsPage>({
  layout: 'main',
  components: { VsTextarea, SuggestionModal },
  mounted() {
    if (suggestionsStore.suggestions.length == 0) {
      this.GetSuggestions()
    }
  },
})
export default class SuggestionsPage extends mixins(LoadScroll) {
  active = false
  @Watch('IsScrolledDown')
  PageHeightChange(val: boolean, oldVal: boolean) {
    if (val) {
      this.LoadMoreSuggestions()
    }
  }

  trimText(iText?: string) {
    if (!iText) return
    const text = iText.trim()
    let getLetters = [text]
    if (text.length > 5) {
      getLetters = text.split(/\s/g).map((item) => {
        return item[0]
      })
    }
    if (getLetters.length > 5) {
      ;[...getLetters] = getLetters[0]
    }
    return getLetters.join('')
  }
  parseDate(d: number) {
    return new Date(d * 1000).toDateString()
  }
  get sortBy() {
    return suggestionsStore.field as 'createdAt' | 'upVotes'
  }
  set sortBy(value: 'createdAt' | 'upVotes') {
    try {
      suggestionsStore.SetSortBy(value)
    } catch (error) {
      console.log({ error })
    }
  }
  sortByOptions = [
    { value: 'createdAt', label: 'Created At' },
    { value: 'upVotes', label: 'Up Votes' }
  ] as const

  async GetLikedSuggestions() {
    if (suggestionsStore.likedSuggestions.length == 0) {
      const loading = this.$vs.loading()
      try {
        await suggestionsStore.GetLikedSuggestions()
      } catch (error) {
        this.$qto.error(error);
      }
      loading.close()
    }
    return
  }
  toggleLike(id: string, time?: any) {
    suggestionsStore.ToggleLikedSuggestion(id)
  }

  userLiked(id: string) {
    return suggestionsStore.likedSuggestions.includes(id)
  }
  GetNextPage() {
    suggestionsStore.GetNextPage()
  }

  get Suggestions() {
    return suggestionsStore.suggestions
  }

  async LoadMoreSuggestions() {

    if (this.IsScrolledDown) {
      const loading = this.$vs.loading()
      try {
        const suggestions = suggestionsStore.GetNextPage()
        await Promise.all([suggestions])
        loading.close()
      } catch (error) {
        console.error({ error })
        loading.close()
      }
      return
    }
  }
  async GetSuggestions() {
    const loading = this.$vs.loading()
    try {
      const suggestions = suggestionsStore.GetSuggestions()
      const favorites = suggestionsStore.GetLikedSuggestions()
      await Promise.all([suggestions, favorites])
      loading.close()
    } catch (error) {
      console.error({ error })
      loading.close()
    }
    return
  }

  pushComingSoon() {
    this.$router.push('/coming-soon')
  }
}
</script>

<style lang="scss"></style>
