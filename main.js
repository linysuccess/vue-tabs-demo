Vue.component('jxm-tab', {
  inject: ['JxmTabs'],
  props: {
    index: {
      type: Number
    }
  },
  computed: {
    isActive: function () {
      return this.JxmTabs.tabIndex === this.index;
    }
  },
  template: `
    <div class="jxm-tab-page" :class="isActive?'active':''"><slot></slot></div>
  `,
  created: function () {
  }
});
Vue.component('jxm-tabs', {
  provide() {
    return { JxmTabs: this };
  },
  template: `
  <div>
    <div class="jxm-tab-nav" ref="navs">
      <div class="jxm-tab-indicator" :style="indicatorStyle"></div>
      <div class="jxm-tab-label" v-for="(item,index) in labels" :class="{active:tabIndex===index}" @click="onPageChange(index)">{{item}}</div>
    </div>
    <div class="jxm-tab-pages" ref="pages">
      <slot></slot>
    </div>
  </div>
`,
  data: function () {
    return {
      tabIndex: 0,
      labels: [],
      labelsWidth: [],
      indicatorOffsets: []
    }
  },
  computed: {
    indicatorStyle: function () {
      return {
        width: this.labelsWidth[this.tabIndex] + 'px',
        transform: 'translate3d(' + this.indicatorOffsets[this.tabIndex] + 'px, 0px, 0px)'
      }
    }
  },
  methods: {
    onPageChange: function (index) {
      this.tabIndex = index;
    }
  },
  watch: {
    tabIndex: function (newVal, oldVal) {
      var list = this.$refs.pages.children;
      list[oldVal].style.display = "none";
      list[newVal].style.display = "block";
    }
  },
  mounted: function () {
    var subs = this.$children;
    var names = [];
    for (var i = 0; i < subs.length; i++) {
      names.push(subs[i].$attrs.title);
    }
    this.$refs.pages.children[this.tabIndex].style.display = 'block';
    this.labels = names;
    this.$nextTick(function () {
      var navList = this.$refs.navs.children;
      var wArr = [];
      var offsets = [];
      var pos = 0;
      for (var i = 1; i < navList.length; i++) {
        wArr.push(navList[i].offsetWidth);
        offsets.push(pos);
        pos += navList[i].offsetWidth;
      }
      this.labelsWidth = wArr;
      this.indicatorOffsets = offsets;
    });
  }
});