import { App, Modal, Setting } from "obsidian";

export class InsertLinkModal extends Modal {
  linkText: string;
  linkUrl: string;

  onSubmit: (linkUrl: string) => void;
  create: (path: string) => void;

  constructor(
    app: App,
    onSubmit: (linkUrl: string) => void,
    create: (path: string) => void
  ) {
    super(app);
    this.onSubmit = onSubmit;
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
        .setButtonText("Insert")
        .setCta()
        .onClick(() => {
          this.close();
          this.onSubmit(this.linkUrl);
        })
    );

    new Setting(contentEl).addButton((btn) =>
      btn
        .setButtonText("create")
        .setCta()
        .onClick(() => {
          this.close();
          this.create("path");
        })
    );
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}