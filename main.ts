import { Editor, Notice, Plugin, FileManager, Vault } from "obsidian";
import { InsertLinkModal } from "./modal";

// instantiate a cont for the output path for files
// prepare a var that is the "template" to be put in the new file
// when the user enters the branch name, it will create a file prefilled with the content
// vault.create(path, data);

export default class InsertLinkPlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: "insert-link",
      name: "Insert link",
      editorCallback: (editor: Editor) => {
        const selectedText = editor.getSelection();

        const onSubmit = (url: string) => {
			if (/^(feature|Improvement|hotfix|bugfix|master)\//g.test(url)) {
				const regex: RegExp = /((?<=((Improvement|feature|hotfix|bugfix)\/))([a-zA-Z]{2,3})\-\d*)|((?<=\d\-).*)/g;
				const matches = [...url.matchAll(regex)];
				const title = matches[1][0].replace(/\-/g, ' ');
				editor.replaceRange(`[[${matches[0][0]}]] - ${titleCase(title)}`, editor.getCursor());
			 } else {
				new Notice("Was not a git branch");
			 };
        };
		
		const create = (path: string) => {
			const files = this.app.vault.getMarkdownFiles();
				for (let i = 0; i < files.length; i++){
					// const test = this.app.vault.getNewFileParent(files[i].path);
					editor.replaceRange(files[i].path, editor.getCursor());
				}
			}
        new InsertLinkModal(this.app, onSubmit, create).open();
      },
    });

	//ur mum lol
	 const statusBarItemEl = this.addStatusBarItem();
	 statusBarItemEl.setText('ur mum');
  }

}

function titleCase(str: string) {
	var splitStr = str.toLowerCase().split(' ');
	for (var i = 0; i < splitStr.length; i++) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
	}
	return splitStr.join(' '); 
 }