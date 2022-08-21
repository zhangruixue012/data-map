<template>
  <div>
    <div class="relation-graph" ref="myPage" style="height:calc(100vh - 50px);" @click="closePanel">
      <div class="input-content">
        <el-input style="width: 180px;margin-right: 5px;" size="small" v-model="inputValue" placeholder="请输入内容"></el-input>
        <el-button size="small" type="primary">搜索</el-button>
      </div>
      <div class="graph-content">
        <SeeksRelationGraph
            ref="seeksRelationGraph"
            :options="graphOptions"
            :on-line-click="onLineClick"
            :on-node-click="onNodeClick">
          <div slot="node" slot-scope="{node}">
            <div style="cursor: pointer;color: #333;height: 90px; width: 110px;line-height: 90px;"
                 @contextmenu.prevent.stop="showFormulaTip(node, $event)">
              <img :src="node.data.myicon" style="width: 80px; height: 80px;"/>
            </div>

            <div style="margin-top:5px;color: #333;text-align: center;">
              <span>{{ node.data.text }}</span>
            </div>

          </div>
        </SeeksRelationGraph>
      </div>

      <div v-show="isShowNodeMenuPanel"
           :style="{left: nodeMenuPanelPosition.x + 'px', top: nodeMenuPanelPosition.y + 'px' }"
           class="node-menu-panel">
        <div class="node-info-item">
          <div class="node-info-item-key">中文名称：</div>
          <div class="node-info-item-value">动用储量</div>
        </div>


        <div class="node-info-item">
          <div class="node-info-item-key">英文名称：</div>
          <div class="node-info-item-value">QT_PRODUCING_RES</div>
        </div>


        <div class="node-info-item">
          <div class="node-info-item-key">节点描述：</div>
          <div class="node-info-item-value">指已经针对其进行了产能建设并进行生产的那一部分（层系、区块或油气田）的储量</div>
        </div>


        <div class="node-info-item">
          <div class="node-info-item-key">创建人：</div>
          <div class="node-info-item-value">***</div>
        </div>

        <div class="node-info-item">
          <div class="node-info-item-key">节点类型：</div>
          <div class="node-info-item-value">数据项（源）</div>
        </div>

        <div class="node-info-item">
          <div class="node-info-item-key">归属部门：</div>
          <div class="node-info-item-value">勘探开发研究院</div>
        </div>

        <div class="node-info-item">
          <div class="node-info-item-key">所属表名：</div>
          <div class="node-info-item-value">MR_ANNUAL_MINING_INS</div>
        </div>
      </div>

      <div v-show="isShowFormulaPanel"
           :style="{left: formulaPanelPosition.x + 'px', top: formulaPanelPosition.y + 'px' }"
            class="node-formula-panel">
          {{ currentFormula }}
      </div>
    </div>
  </div>
</template>

<script>
import SeeksRelationGraph from "relation-graph";
import activeNode from "../assets/img/node_blue.png";
import grayNode from "../assets/img/node_gray.png";
import background from '../assets/img/background.png'

export default {
  name: "blood-ship",
  components: {SeeksRelationGraph},
  data() {
    return {
      // g_loading: true,
      demoname: "---",
      inputValue: '',
      currentFormula: '',
      isShowNodeMenuPanel: false,
      isShowFormulaPanel: false,
      nodeMenuPanelPosition: {x: 0, y: 0},
      formulaPanelPosition: {x: 0, y: 0},
      graphOptions: {
        backgrounImage: background,
        layouts: [
          {
            label: '树',
            layoutName: 'tree',
            layoutClassName: 'seeks-layout-center',
            defaultNodeShape: 0,
            defaultLineShape: 1,
            from: 'right',
          }
        ],
        allowSwitchLineShape: true,
        allowSwitchJunctionPoint: true,
        defaultJunctionPoint: 'lr',
        defaultNodeShape: 1,
        defaultNodeWidth: '100',
        defaultLineShape: 4,
        isMoveByParentNode:true, //拖拽节点后子节点跟着移动
        defaultNodeBorderWidth: 0,
        defaultLineColor: '#3277e5',
        defaultNodeColor: 'transparent',
        moveToCenterWhenResize: true,
      },
    };
  },
  created() {
  },
  mounted() {
    this.demoname = this.$route.params.demoname;
    this.setGraphData();
  },
  methods: {
    setGraphData() {
      // 使用要点：通过节点属性expandHolderPosition: 'right' 和 expanded: false 可以让节点在没有子节点的情况下展示一个"展开"按钮
      //         通过onNodeExpand事件监听节点，在被展开的时候有选择的去从后台获取数据，如果已经从后台加载过数据，则让当前图谱根据当前的节点重新布局
      const graphData = {
        rootId: 'a',
        nodes: [
          {id: 'a', name: 'a', data: {myicon: activeNode, text: '水驱控制储量', formula: '水驱控制储量 = 水驱储量控制程度*地质储量'}, color: '#fff'},
          {id: 'b', name: 'b', data: {myicon: activeNode, text: '水驱储量控制程度表', formula: '水驱控制程度 = 与注水井连通的采油井射开的有效厚度（m）/ 井组内采油井射开的总有效厚度（m）'}, color: '#fff'},
          {id: 'b1', name: 'b1', data: {myicon: activeNode, text: '与注水井连通采油井射开有效厚度', formula: '与注水井连通的采油井射开的有效厚度=∑井组内见效油井射开的有效厚度'}, color: '#fff'},
          {id: 'b2', name: 'b2', data: {myicon: activeNode, text: '与注水井连通采油井射开有效厚度', formula: '井组内采油井射开的总有效厚度=∑(单井的有效厚度底界井深-单井有效厚度顶界井深）'}, color: '#fff'},
          {id: 'b1-1', name: 'b1-1', data: {myicon: grayNode, text: '是否见效'}, color: '#fff'},
          {id: 'b1-2', name: 'b1-2', data: {myicon: activeNode, text: '射开有效厚度'}, color: '#fff'},
          {id: 'b2-1', name: 'b2-1', data: {myicon: activeNode, text: '射孔层位'}, color: '#fff'},
          {id: 'c', name: 'c', data: {myicon: activeNode, text: '动用储量'}, color: '#fff'}],
        links: [
          {from: 'b', to: 'a'},
          {from: 'c', to: 'a'},
          {from: 'b1', to: 'b'},
          {from: 'b2', to: 'b'},
          {from: 'b1-1', to: 'b1'},
          {from: 'b1-2', to: 'b1'},
          {from: 'b1-2', to: 'b2'},
          {from: 'b2-1', to: 'b2'},
          {from: 'b2-1', to: 'b1'}
        ]
      };


      this.$refs.seeksRelationGraph.setJsonData(graphData, seeksRGGraph => {
        // 这些写上当图谱初始化完成后需要执行的代码
        this.$refs.seeksRelationGraph.refresh();
      })
    },

    closePanel() {
      this.isShowNodeMenuPanel = false;
      this.isShowFormulaPanel = false;
    },

    //点击节点
    onNodeClick(nodeObject, $event) {
      this.showNodeMenus(nodeObject, $event);
    },

    showNodeMenus(nodeObject, $event) {
      this.currentNode = nodeObject;
      const _base_position = this.$refs.myPage.getBoundingClientRect()
      console.log('showNodeMenus:', $event, _base_position)
      this.isShowNodeMenuPanel = true
      this.nodeMenuPanelPosition.x = $event.clientX - _base_position.x
      this.nodeMenuPanelPosition.y = $event.clientY - _base_position.y
    },

    showFormulaTip(nodeObject, $event) {
      console.log('nodeObject:', nodeObject);
      if (nodeObject.data.formula) {
        this.currentFormula = nodeObject.data.formula;
        this.isShowFormulaPanel = true;
        const _base_position = this.$refs.myPage.getBoundingClientRect();
        this.formulaPanelPosition.x = $event.clientX - _base_position.x
        this.formulaPanelPosition.y = $event.clientY - _base_position.y
      }

    },

    onLineClick(lineObject, $event) {
    //   console.log(lineObject, $event);
    }
  }
};
</script>

<style scope>

.relation-graph {
  padding: 0 14px 14px 14px;
}

.input-content {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 14px;
}


.graph-content {
  height:calc(100vh - 160px);
}

.c-collapsed {
  background-color: #3277e5 !important;
}

.c-expanded {
  background-color: #3277e5 !important;
}

.node-menu-panel {
  width: 245px;
  z-index: 999;
  padding: 10px;
  position: absolute;
  background: #fff;
  border: 1px solid #eceff4;
  opacity: 0.86;
  border-radius: 8px;
  overflow-x: hidden;
  overflow-y: auto;
  font-size: 12px;
  text-align: left;
  color: #262626;
  filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.16));
}

.node-info-item {
  display: flex;
  margin-bottom: 8px;
}

.node-info-item-key {
  width: 70px;
}

.node-info-item-value {
  width: calc(100% - 70px);
}

.node-formula-panel {
  display: flex;
  align-items: center;
  padding: 10px;
  z-index: 1000;
  position: absolute;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fbf4e8;
  border: 1px solid #f3d5b7;
  color: #fb891d;
  font-size: 16px;
  border-radius: 8px;
}
.rel-node {
  background: transparent !important;
}




</style>
