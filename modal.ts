import { App, Modal, Setting } from "obsidian";

export class InsertTaskModal extends Modal {
  linkUrl: string;

  create: (path: string) => void;

  constructor(
    app: App,
    create: (path: string) => void
  ) {
    super(app);
    this.create = create;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h3", { text: "Quick Template" });

    new Setting(contentEl).setName("Branch name:").addText((text) =>
      text.setValue(this.linkUrl).onChange((value) => {
        this.linkUrl = value;
      })
    );

    new Setting(contentEl).addButton((btn) =>
      btn
        .setButtonText("create")
        .setCta()
        .onClick(() => {
          this.close();
          this.create(this.linkUrl);
        })
    );
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}
