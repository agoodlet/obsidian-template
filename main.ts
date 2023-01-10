import { Editor, Notice, Plugin, FileManager, Vault } from "obsidian";
import { InsertTaskModal } from "./modal";

// instantiate a cont for the output path for files
// prepare a var that is the "template" to be put in the new file
// when the user enters the branch name, it will create a file prefilled with the content
// vault.create(path, data);

export default class InsertTaskPlugin extends Plugin {
	async onload() {


		this.addCommand({
			id: "insert-link",
			name: "Insert link",
			editorCallback: (editor: Editor) => {
				const create = (url: string) => {
					if (/^(feature|Improvement|hotfix|bugfix|master)\//g.test(url)) {
						const regex: RegExp = /((?<=((Improvement|feature|hotfix|bugfix)\/))([a-zA-Z]{1,4})\-\d*)|((?<=\d\-).*)/g;
						const matches = [...url.matchAll(regex)];
						const title = matches[1][0].replace(/\-/g, ' ');
						const id = matches[0][0];

						editor.replaceRange(`[[${id}]] - ${titleCase(title)}`, editor.getCursor());

						const template = `# ${title}

## Brief

## Possible Situations

## Other parts of the app this could effect`;

						const files = this.app.vault.getMarkdownFiles();
						const test = this.app.fileManager.getNewFileParent(files[1].path);
						const finalPath = test.path !== '/' ? `${test.path}/` : test.path;
						try {
							this.app.vault.create(`${finalPath}${id}.md`, template);
							new Notice(`created ${finalPath}${id}.md`);
						} catch {
							new Notice(`Could not create ${finalPath}${id}.md`)
						}
					} else {
						new Notice("Was not a git branch");
					};
				}

				new InsertTaskModal(this.app, create).open();
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