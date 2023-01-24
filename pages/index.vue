<template>
  <div class="bg-slate-900 min-h-screen text-white font-mono">
    <div class="container mx-auto py-10 px-2 grid gap-y-4">
      <div class="font-bold">Terra Chain Inspection For Spesific Events</div>

      <div
        class="bg-gray-800 border-gray-700 rounded-lg shadow-md p-6 whitespace-normal"
      >
        <div class="font-bold text-lg text-white/50">Note!</div>
        <div class="italic">
          This app is to inspect the terra network performance when spesific
          events is happen on terra ecosystem. Did the event make the
          significant changes to the new wallet, total transaction, price of
          luna, netflow of luna staking or active wallets in a {{ time }} before and after the events (?)
        </div>
      </div>
      <div class="text-white/50 font-bold text-lg">Select Events</div>
      <div>
        <div class="relative inline-block text-left">
          <div>
            <button
              type="button"
              class="inline-flex w-full items-center gap-x-3 justify-center rounded-md border border-gray-300 bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
              @click="openDropdown = !openDropdown"
              @blur="test"
            >
              <div>{{ selectedEvents }}</div>
              <ion-icon name="chevron-down-sharp"></ion-icon>
            </button>
          </div>

          <div
            v-if="openDropdown"
            class="absolute left-0 z-10 mt-2 w-fit origin-top-left rounded-md bg-slate-800 text-white shadow-lg ring-1 ring-black ring-opacity-5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabindex="-1"
            autofocus
          >
            <div class="py-1" role="none">
              <div
                v-for="(item, index) in listEvents"
                :key="index"
                class="block px-4 py-2 text-sm hover:bg-slate-600 whitespace-nowrap cursor-pointer"
                role="menuitem"
                :tabindex="`-${index + 1}`"
                :id="`menu-item-${index}`"
                @click="selectedEvents = item.name"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-white/50 font-bold text-lg">Time Range Comparison</div>
      <div class="flex items-center gap-x-4">
        <div @click="time = 'day'" :class="{'!text-white ring-1 ring-white': time === 'day'}" class="cursor-pointer bg-slate-800 text-white/50 px-5 py-2 rounded-xl shadow-md hover:ring-1 hover:ring-white hover:text-white">1 Day</div>
        <div @click="time = 'week'" :class="{'!text-white ring-1 ring-white': time === 'week'}" class="cursor-pointer bg-slate-800 text-white/50 px-5 py-2 rounded-xl shadow-md hover:ring-1 hover:ring-white hover:text-white">1 Week</div>
      </div>
      <div class="text-white/50 font-bold text-lg">Overall Summary</div>
      <div class="grid gap-y-4 grid-cols-1 lg:grid lg:grid-cols-2 lg:gap-x-4">
        <div class="bg-slate-800 p-4 rounded-xl shadow-md">
          <div v-if="!loading.diffNewWallets">
            <div class="font-bold text-white/50 text-sm">
              Changes (%) in <span class="text-white">New Wallets</span> Before & After The Events
            </div>
            <div
              :class="{
                'text-green-600': result.diffNewWallets > 0,
                'text-red-600': result.diffNewWallets < 0,
              }"
              class="text-2xl font-bold"
            >
              {{ new Intl.NumberFormat().format(result.diffNewWallets)
              }}<span class="text-base">%</span>
            </div>
          </div>
          <div v-else class="grid gap-y-2">
            <Skeleton />
            <Skeleton width="full" />
          </div>
        </div>
        <div class="bg-slate-800 p-4 rounded-xl shadow-md">
          <div v-if="!loading.diffTransactions">
            <div class="font-bold text-white/50 text-sm">
              Changes (%) in <span class="text-white">Total Transactions</span> Before & After The Events
            </div>
            <div
              :class="{
                'text-green-600': result.diffTransactions > 0,
                'text-red-600': result.diffTransactions < 0,
              }"
              class="text-2xl font-bold"
            >
              {{ new Intl.NumberFormat().format(result.diffTransactions)
              }}<span class="text-base">%</span>
            </div>
          </div>
          <div v-else class="grid gap-y-2">
            <Skeleton />
            <Skeleton width="full" />
          </div>
        </div>
        <div class="bg-slate-800 p-4 rounded-xl shadow-md">
          <div v-if="!loading.diffActive">
            <div class="font-bold text-white/50 text-sm">
              Changes (%) in <span class="text-white">Active Wallets</span> Before & After The Events
            </div>
            <div
              :class="{
                'text-green-600': result.diffActive > 0,
                'text-red-600': result.diffActive < 0,
              }"
              class="text-2xl font-bold"
            >
              {{ new Intl.NumberFormat().format(result.diffActive)
              }}<span class="text-base">%</span>
            </div>
          </div>
          <div v-else class="grid gap-y-2">
            <Skeleton />
            <Skeleton width="full" />
          </div>
        </div>
         <div class="bg-slate-800 p-4 rounded-xl shadow-md">
          <div v-if="!loading.diffStaking">
            <div class="font-bold text-white/50 text-sm">
              Changes (%) in <span class="text-white"> Netflow staking</span> Before & After The Events
            </div>
            <div
              :class="{
                'text-green-600': result.diffStaking > 0,
                'text-red-600': result.diffStaking < 0,
              }"
              class="text-2xl font-bold"
            >
              {{ new Intl.NumberFormat().format(result.diffStaking)
              }}<span class="text-base">%</span>
            </div>
          </div>
          <div v-else class="grid gap-y-2">
            <Skeleton />
            <Skeleton width="full" />
          </div>
        </div>
      </div>

      <div class="text-white/50 font-bold text-lg">Daily Charts</div>
      <div class="bg-slate-800 p-4 flex rounded-xl shadow-md">
        <CreateChart
          v-if="!loading.totalTransactions"
          :dataSeries="result.totalTransactions"
          :title="'Daily Total Transactions'"
          :aXaxis="templateAnnotation"
          class="w-full"
        />
        <div v-else class="grid gap-y-2 w-full">
          <Skeleton />
          <Skeleton width="full" height="big" />
        </div>
      </div>
      <div class="bg-slate-800 p-4 flex rounded-xl shadow-md">
        <CreateChart
          v-if="!loading.newWallets"
          :dataSeries="result.newWallets"
          :title="'Daily Total New Wallets'"
          :aXaxis="templateAnnotation"
          class="w-full"
        />
        <div v-else class="grid gap-y-2 w-full">
          <Skeleton />
          <Skeleton width="full" height="big" />
        </div>
      </div>
      <div class="bg-slate-800 p-4 flex rounded-xl shadow-md">
        <CreateChart
          v-if="!loading.price"
          :dataSeries="result.price"
          :title="'Daily Luna Price'"
          :aXaxis="templateAnnotation"
          class="w-full"
        />
        <div v-else class="grid gap-y-2 w-full">
          <Skeleton />
          <Skeleton width="full" height="big" />
        </div>
      </div>
      <div class="bg-slate-800 p-4 flex rounded-xl shadow-md">
        <CreateChart
          v-if="!loading.activeUser"
          :dataSeries="result.activeUser"
          :title="'Daily Active Wallets'"
          :aXaxis="templateAnnotation"
          class="w-full"
        />
        <div v-else class="grid gap-y-2 w-full">
          <Skeleton />
          <Skeleton width="full" height="big" />
        </div>
      </div>
      <div class="bg-slate-800 p-4 flex rounded-xl shadow-md">
        <CreateChart
          v-if="!loading.netflowStaking"
          :dataSeries="result.netflowStaking"
          :title="'Daily Netflow $LUNA Stake'"
          :aXaxis="templateAnnotation"
          class="w-full"
        />
        <div v-else class="grid gap-y-2 w-full">
          <Skeleton />
          <Skeleton width="full" height="big" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken, getData } from "../utils/index";
import {
  queryTotalTransactions,
  queryNewWallets,
  queryActiveUsers,
  queryNetflowStaking,
  queryDiffNewWallet,
  queryDiffStaking,
  queryDiffTransaction,
  queryActiveWallet,
} from "../utils/dataQuery";
export default {
  name: "IndexPage",
  data() {
    return {
      listEvents: [
        {
          name: "The Launch of Station",
          date: "2023-01-15",
        },
        {
          name: "Astroport Delay $ASTRO Unlock For 6 Months",
          date: "2022-12-03",
        },
        {
          name: "The Launch of Enterprise Protocol (BETA)",
          date: "2022-11-28",
        },
        {
          name: "HERO NFT Back To Terra",
          date: "2022-12-02",
        },
        {
          name: "The Launch of TFM Aggregator",
          date: "2022-07-07",
        },
        {
          name: "The Launch of Skip Protocol",
          date: "2022-12-09",
        },
        {
          name: "The Launch of Coinhall",
          date: "2022-10-26",
        },
        {
          name: "The Launch of Astroport",
          date: "2022-06-03",
        },
        {
          name: "The Launch of Knowhere",
          date: "2022-06-18",
        },
        {
          name: "The Launch of Orne",
          date: "2022-09-01",
        },
        {
          name: "The Launch of Prism",
          date: "2022-09-28",
        },
        {
          name: "The Launch of Spectrum",
          date: "2022-09-11",
        },
        {
          name: "The Launch of Terra Poker",
          date: "2022-09-22",
        },
      ],
      loading: {
        totalTransactions: true,
        newWallets: true,
        price: true,
        activeUser: true,
        netflowStaking: true,
        diffNewWallets: true,
        diffTransactions: true,
        diffStaking: true,
        diffActive: true,
      },
      result: {
        totalTransactions: null,
        newWallets: null,
        price: null,
        activeUser: null,
        netflowStaking: null,
        diffNewWallets: null,
        diffTransactions: null,
        diffStaking: null,
        diffActive: null
      },
      openDropdown: false,
      time: 'day',
      selectedEvents: "The Launch of Station",
      templateAnnotation: [
        {
          x: new Date("2023-01-15").getTime(),
          strokeDashArray: 2,
          borderColor: "#775DD0",
          label: {
            borderColor: "#775DD0",
            style: {
              color: "#fff",
              background: "#775DD0",
            },
            text: "The Launch of Station",
          },
        },
      ],
    };
  },
  watch: {
    selectedEvents() {
      const temp = this.listEvents.find((elem) => {
        return elem.name === this.selectedEvents;
      });
      this.templateAnnotation[0].label.text = temp.name;
      this.templateAnnotation[0].x = new Date(temp.date).getTime();
      this.runAll();
    },
    time(){
      this.runAll()
    }
  },
  async mounted() {
    this.runAll();
  },
  methods: {
    runAll() {
      this.fetchTotalTransactions();
      this.fetchNewWallets();
      this.fetchPrice();
      this.fetchActiveUsers();
      this.fetchNetflowStaking();
      this.fetchDiffNewWallets();
      this.fetchDiffTransactions();
      this.fetchDiffStaking();
      this.fetchDiffActiveWallet();
    },
    async fetchDiffActiveWallet() {
      this.loading.diffActive = true;
      
      const token = await getToken(
        queryActiveWallet(
          this.listEvents.find((elem) => {
            return elem.name === this.selectedEvents;
          }).date,
          this.time
        ),
        this.$axios,
        this.$config.apiKey
      );
      const result = await getData(
        token.result,
        this.$axios,
        this.$config.apiKey
      );
      if (result && result.status === 200) {
        this.result.diffActive = result.result.results[0][0];
        this.loading.diffActive = false;
      }
    },
    async fetchDiffStaking() {
      this.loading.diffStaking = true;
      
      const token = await getToken(
        queryDiffStaking(
          this.listEvents.find((elem) => {
            return elem.name === this.selectedEvents;
          }).date,
          this.time
        ),
        this.$axios,
        this.$config.apiKey
      );
      const result = await getData(
        token.result,
        this.$axios,
        this.$config.apiKey
      );
      if (result && result.status === 200) {
        this.result.diffStaking = result.result.results[0][0];
        this.loading.diffStaking = false;
      }
    },
    async fetchDiffTransactions() {
      this.loading.diffTransactions = true;
      
      const token = await getToken(
        queryDiffTransaction(
          this.listEvents.find((elem) => {
            return elem.name === this.selectedEvents;
          }).date,
          this.time
        ),
        this.$axios,
        this.$config.apiKey
      );
      const result = await getData(
        token.result,
        this.$axios,
        this.$config.apiKey
      );
      if (result && result.status === 200) {
        this.result.diffTransactions = result.result.results[0][0];
        this.loading.diffTransactions = false;
      }
    },
    async fetchDiffNewWallets() {
      this.loading.diffNewWallets = true;
      
      const token = await getToken(
        queryDiffNewWallet(
          this.listEvents.find((elem) => {
            return elem.name === this.selectedEvents;
          }).date,
          this.time
        ),
        this.$axios,
        this.$config.apiKey
      );
      const result = await getData(
        token.result,
        this.$axios,
        this.$config.apiKey
      );
      if (result && result.status === 200) {
        this.result.diffNewWallets = result.result.results[0][0];
        this.loading.diffNewWallets = false;
      }
    },
    async fetchNetflowStaking() {
      this.loading.netflowStaking = true;
      const token = await getToken(
        queryNetflowStaking,
        this.$axios,
        this.$config.apiKey
      );
      const result = await getData(
        token.result,
        this.$axios,
        this.$config.apiKey
      );
      if (result && result.status === 200) {
        this.result.netflowStaking = result.result.results;
        this.loading.netflowStaking = false;
      }
    },
    async fetchTotalTransactions() {
      this.loading.totalTransactions = true;
      const token = await getToken(
        queryTotalTransactions,
        this.$axios,
        this.$config.apiKey
      );
      const result = await getData(
        token.result,
        this.$axios,
        this.$config.apiKey
      );
      if (result && result.status === 200) {
        this.result.totalTransactions = result.result.results;
        this.loading.totalTransactions = false;
      }
    },
    async fetchNewWallets() {
      this.loading.newWallets = true;
      const token = await getToken(
        queryNewWallets,
        this.$axios,
        this.$config.apiKey
      );
      const result = await getData(
        token.result,
        this.$axios,
        this.$config.apiKey
      );
      if (result && result.status === 200) {
        this.result.newWallets = result.result.results;
        this.loading.newWallets = false;
      }
    },
    async fetchActiveUsers() {
      this.loading.activeUser = true;
      const token = await getToken(
        queryActiveUsers,
        this.$axios,
        this.$config.apiKey
      );
      const result = await getData(
        token.result,
        this.$axios,
        this.$config.apiKey
      );
      if (result && result.status === 200) {
        this.result.activeUser = result.result.results;
        this.loading.activeUser = false;
      }
    },
    async fetchPrice() {
      this.loading.price = true;
      const d = await this.$axios.get(
        "https://api.coingecko.com/api/v3/coins/terra-luna-2/market_chart?vs_currency=usd&days=max&interval=daily"
      );
      if (d.status === 200) {
        this.result.price = d.data.prices;
        this.loading.price = false;
      }
    },
    test() {
      setTimeout(() => {
        this.openDropdown = false;
      }, 300);
    },
  },
};
</script>
