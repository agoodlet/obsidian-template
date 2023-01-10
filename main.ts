import { Editor, Notice, Plugin, FileManager, Vault } from "obsidian";
import { InsertTaskModal } from "./modal";

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

						// pulling out the title and the ID so they are easier to work with
						const title = matches[1][0].replace(/\-/g, ' ');
						const id = matches[0][0];

						// add the line to the main tracker
						editor.replaceRange(`[[${id}]] - ${titleCase(title)}`, editor.getCursor());

						// maybe find a way to obfuscate this template to another file
						const template = `# ${title}

## Brief
**Succinct rewrite of the task in own words to better understand the task**

## Possible Situations
**What are all the possible situations that someone can encounter relative to the task**

- situation_1
- situation_2

## Other parts of the app this could effect
**Is there any other aspect of the app that could be effected by the changes made**
`;

						const files = this.app.vault.getMarkdownFiles();
						const fileParent = this.app.fileManager.getNewFileParent(files[1].path);
						const finalPath = fileParent.path !== '/' ? `${fileParent.path}/${id}.md` : `${fileParent.path}${id}.md`;
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

		// add 'ur mum' to the status bar at the bottom lol
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