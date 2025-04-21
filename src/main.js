import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router";
// 1. 引入你需要的组件
import {
  ConfigProvider,
  Button,
  Circle,
  Popup,
  List,
  Cell,
  Collapse,
  CollapseItem,
  Popover,
  Toast,
  Icon,
  FloatingBubble,
  Field,
  CellGroup,
  Switch,
  Form,
  RadioGroup,
  Radio,
  Calendar,
  TimePicker,
  ActionBar,
  ActionBarIcon,
  ActionBarButton,
  Loading,
} from "vant";
// 2. 引入组件样式
import "vant/lib/index.css";

const app = createApp(App);

// 3. 注册你需要的组件
app.use(Button);
app.use(Circle);
app.use(Popup);
app.use(List);
app.use(Cell);
app.use(ConfigProvider);
app.use(Collapse);
app.use(CollapseItem);
app.use(Popover);
app.use(Toast);
app.use(Icon);
app.use(FloatingBubble);
app.use(Field);
app.use(CellGroup);
app.use(Switch);
app.use(Form);
app.use(RadioGroup);
app.use(Radio);
app.use(Calendar);
app.use(TimePicker);
app.use(ActionBar);
app.use(ActionBarIcon);
app.use(ActionBarButton);
app.use(Loading);

const pinia = createPinia();
pinia.use(piniaPersist);
app.use(pinia);

app.use(router).mount("#app");
