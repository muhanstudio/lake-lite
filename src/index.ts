import {
    Plugin,
    openTab,
    Menu,
    getFrontend,
    Dialog
} from "siyuan";

import "./index.scss";

const TAB_TYPE = "custom_tab";
const DOCK_TYPE = "dock_tab";

export default class lakelite extends Plugin {

    private isMobile: boolean;

    private addMenu(rect?: DOMRect) {
        const menu = new Menu("topBarSample");
        menu.addItem({
            icon: "iconYuQue",
            label: this.i18n.newTip,
            click: () => {
                this.openlaketab("new.html");
            }
        });
        menu.addItem({
            icon: "iconYuQue",
            label: this.i18n.openLocalFileTip,
            click: () => {
                this.openlaketab("all.html");
            }
        });
        menu.addItem({
            icon: "iconYuQue",
            label: this.i18n.reload,
            click: () => {
                window.location.reload();
            }
        });
        menu.open({
            x: rect.right,
            y: rect.bottom,
            isLeft: true,
        });
    }

    async openlaketab(goto: string) {
        try {
            openTab({
                app: this.app,
                custom: {
                    icon: "iconYuQue",
                    title: this.i18n.addTopBarIcon,
                    data: {
                        goto: goto,
                    },
                    id: this.name + TAB_TYPE,
                },
            });
        } catch (error) {
            console.error("Error opening tab:", error);
        }
    }

    private showDialog() {
        new Dialog({
            title: this.i18n.runFirst,
            content: `<div class="b3-dialog__content">
<div>语雀插件可以干什么</div>
<div class="fn__hr"></div>
<div class="plugin-sample__time">本插件可以赋予你在思源里查看，编辑，新建语雀文档的能力，支持在本地离线环境下，在思源笔记里新建语雀文档或者浏览/编辑你在笔记里引用的lake格式的语雀文档</div>
<div class="fn__hr"></div>
<div class="fn__hr"></div>
<div>插件如何使用</div>
<div class="fn__hr"></div>
<div class="plugin-sample__time">点击右上角语雀标志查看菜单，左顶部dock语雀图标可以浏览所有的语雀文档</div>
<div class="fn__hr"></div>
<div class="fn__hr"></div>
<div>新建的语雀文档存在哪里</div>
<div class="fn__hr"></div>
<div class="plugin-sample__time">文档本体在(data/public/lark-editor/lark/)下面，插入文档的附件在(data/public/lark-editor/larkattachments/{笔记创建时间戳}/)下面<span id="time"></span></div>
<div class="fn__hr"></div>
<div class="fn__hr"></div>
</div>`,
            width: this.isMobile ? "92vw" : "560px",
            height: "540px",
        });
    }

    async onload() {
        window.openlaketab = this.openlaketab.bind(this);

        window.addEventListener("message", (event) => {
            if (event.data.action === "openlaketab") {
                openlaketab(event.data.goto);
            }
        });


        const frontEnd = getFrontend();
        this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";
        const runfirst = await this.loadData("runfirst");
        if (!runfirst) {
            this.showDialog();
            this.saveData("runfirst", "1");
        }

        const addClickEventToLakeSpans = () => {
            const lakeSpans = document.querySelectorAll('span[data-href$=".lake"]');
            lakeSpans.forEach(span => {
                if (!span.hasAttribute("data-listener-added")) {
                    span.addEventListener("click", (event) => {
                        // 阻止默认行为和事件冒泡
                        event.preventDefault();
                        event.stopPropagation();

                        const dataHref = span.getAttribute("data-href");
                        const url = `preview.html?path=/data/${dataHref}`;
                        this.openlaketab(url);
                        if (this.isMobile) {
                            window.location.href = "/plugins/lake-lite/lark-editor/" + url;
                        }
                    });
                    // 标记该元素已经添加了事件监听器
                    span.setAttribute("data-listener-added", "true");
                }
            });
        };

        // 初始添加事件
        addClickEventToLakeSpans();

        // 观察DOM变化
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === "childList" || mutation.type === "attributes") {
                    addClickEventToLakeSpans();
                }
            });
        });

        // 配置观察选项
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["data-href"]
        });

        this.addIcons(`<symbol id="iconYuQue" viewBox="0 0 1121 1024">
  <path d="M1118.415339 145.958083l-91.292562-4.976133s-34.528264-123.607802-192.99438-134.698314c-158.466116-11.086281-262.152463-4.12562-262.152463-4.125619s117.54843 76.355702 70.440198 212.606942c-35.002182 73.48681-90.378579 133.530446-149.419372 202.536198L102.586182 871.931769c363.426909-5.437355 577.688331-8.158149 642.788496-8.158149 182.563967 0 336.853686-161.546579 330.540429-341.288199-4.341421-123.531636-42.885289-151.441983-56.133818-205.544727-13.244298-54.102744 13.269686-140.381091 98.63405-170.982611z" fill="#31CC79"/>
  <path d="M491.401521 418.769455C300.311273 638.976 0 989.336331 0 989.336331c540.265785 144.688661 789.186645-206.471405 828.166347-328.03967 52.257851-162.993719-21.580165-242.527207-63.369521-268.465719-141.692826-87.945521-246.822083-4.684165-273.395305 25.938513z" fill="#93E65C"/>
  <path d="M499.390413 410.006215c35.907702-34.739835 135.713851-98.99795 266.595438-17.763438 41.950149 26.040066 116.084364 105.890909 63.619174 269.540496-15.220364 47.463669-62.315901 129.789884-146.097719 204.144132-86.671868 0.592397-280.808727 3.143934-582.410579 7.654612l373.214149-434.603372c8.145455-9.520661 16.218975-18.863603 24.174017-28.092298z" fill="#60DB69" opacity=".86"/>
</symbol>`);

        this.addDock({
            config: {
                position: "LeftTop",
                size: {width: 200, height: 0},
                icon: "iconYuQue",
                title: "语雀文档",
                hotkey: "⌥⌘Y",
            },
            data: {
                text: "This is my custom dock"
            },
            type: DOCK_TYPE,
            init: (dock) => {
                if (this.isMobile) {
                    dock.element.innerHTML = `<div class="toolbar toolbar--border toolbar--dark">
            <svg class="toolbar__icon"><use xlink:href="#iconYuQue"></use></svg>
                <div class="toolbar__text">语雀文档</div>
            </div>
            <div class="fn__flex-1 plugin-sample__custom-dock">
              <div class="link" style="width: 100%; height: 100%; overflow: hidden;">
                  <iframe src="/plugins/lake-lite/lark-editor/all.html" style="width: 100%; height: 100%; border: none; position: absolute; top: 0; left: 0;"></iframe>
              </div>
            </div>
            `;
                } else {
                    dock.element.innerHTML = `
<div class="fn__flex-1 fn__flex-column">
    <div class="block__icons">
        <div class="block__logo">
            <svg class="block__logoicon"><use xlink:href="#iconYuQue"></use></svg>
            语雀文档
        </div>
        <span class="fn__flex-1 fn__space"></span>
        <span aria-label="刷新" class="block__icon b3-tooltips"><svg class="block__logoicon"><use xlink:href="#iconRefresh"></use></svg></span>
        <span data-type="min" aria-label="收起" class="block__icon b3-tooltips b3-tooltips__sw"><svg class="block__logoicon"><use xlink:href="#iconMin"></use></svg></span>
    </div>
    <div class="fn__flex-1 plugin-sample__custom-dock">
        <div class="link" style="width: 100%; height: 87vh; overflow: auto;">
            <iframe src="/plugins/lake-lite/lark-editor/list.html" style="width: 100%; height: 100%; border: none; display: block;"></iframe>
        </div>
    </div>
</div>`;

                    // 绑定事件监听器
                    const refreshButton = dock.element.querySelector('.block__icon[aria-label="刷新"]');
                    const iframe = dock.element.querySelector("iframe");

                    if (refreshButton && iframe) {
                        refreshButton.addEventListener("click", function () {
                            iframe.src = iframe.src; // 重新加载iframe
                        });
                    } else {
                        console.error("未能找到刷新按钮或iframe元素");
                    }
                }
            }

        });

        this.addTab({
            type: TAB_TYPE,
            init() {
                this.element.innerHTML = `
            <div class="link" style="width: 100%; height: 100%; overflow: auto;">
    <iframe src="/plugins/lake-lite/lark-editor/${this.data.goto}" style="width: 100%; height: 100%; border: none; display: block;"></iframe>
</div>
            `;
            }
        });

        this.addCommand({
            langKey: "打开语雀编辑器首页",
            hotkey: "⇧⌘Y",
            callback: () => {
                this.openlaketab("new");
            },
        });

        const topBarElement = this.addTopBar({
            icon: "iconYuQue",
            title: this.i18n.addTopBarIcon,
            position: "right",
            callback: () => {
                if (this.isMobile) {
                    this.openlaketab("all");
                } else {
                    let rect = topBarElement.getBoundingClientRect();
                    // 如果被隐藏，则使用更多按钮
                    if (rect.width === 0) {
                        rect = document.querySelector("#barMore").getBoundingClientRect();
                    }
                    if (rect.width === 0) {
                        rect = document.querySelector("#barPlugins").getBoundingClientRect();
                    }
                    this.addMenu(rect);
                }
            }
        });
    }
}