import { Editor, Notice, Plugin, FileManager, Vault } from "obsidian";
import { InsertTaskModal } from "./modal";
import * as fs from "fs";

export default class InsertTaskPlugin extends Plugin {
	async onload() {
		var template = getTemplateFromDir("templates_mine");
		console.log(template);
		//add command for current date heading
		this.addCommand({
			id: "insert-date",
			name: "Insert Date",
			editorCallback: (editor: Editor) => {
				const curDate = new Date;
				const day = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(curDate);
				const date = curDate.toLocaleDateString('en-GB', {timeZone: "Australia/Sydney"});
				editor.replaceRange(`## ${day}-${date}`, editor.getCursor());
			}
		})

		//add command for template
		this.addCommand({
			id: "insert-link",
			name: "Insert link",
			editorCallback: (editor: Editor) => {
				const create = (url: string) => {
					let title = "";
					let id = "";
					if (/^(feature|(I|i)mprovement|hotfix|bug|bugfix|master)\//g.test(url)) {
						const matches = [...url.matchAll(/((?<=(((I|i)mprovement|feature|hotfix|bug|bugfix)\/))([a-zA-Z]{1,4})\-\d*)|((?<=\d\-).*)/g)];

						// pulling out the title and the ID so they are easier to work with
						title = matches[1][0].replace(/\-/g, ' ');
						id = matches[0][0];

						// add the line to the main tracker
						editor.replaceRange(`[[${id}]] - ${titleCase(title)}`, editor.getCursor());

					} else {
						const matches = [...url.matchAll(/(([a-zA-Z]{1,4})\-\d*)|((?<=\d\-).*)/g)];

						title = matches[1][0];
						id = matches[0][0];

						editor.replaceRange(`[[${id}]] - ${titleCase(title)}`, editor.getCursor());
					}
						// TODO: maybe find a way to obfuscate this template to another file
// 						const template = `# ${title}

// ### Brief
// **Succinct rewrite of the task in own words to better understand the task**

// ### Possible Situations
// **What are all the possible situations that someone can encounter relative to the task**

// - situation_1
// - situation_2

// ### Other parts of the app this could effect
// **Is there any other aspect of the app that could be effected by the changes made**
// `;

						// TODO abstract the process of getting the path to it's own function
						const files = this.app.vault.getMarkdownFiles();
						const fileParent = this.app.fileManager.getNewFileParent(files[1].path);
						const finalPath = fileParent.path !== '/' ? `${fileParent.path}/${id}.md` : `${fileParent.path}${id}.md`;
						new Notice(`${finalPath}`)
						try {
							this.app.vault.create(`${finalPath}`, template);
							new Notice(`created ${finalPath}`);
						} catch {
							new Notice(`Could not create ${finalPath}`)
						}
					}
				new InsertTaskModal(this.app, create).open();
			},
		});
		// add 'ur mum' to the status bar at the bottom lol
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('ur mum');
	}

}

// TODO abstract the process of getting the path to it's own function
function getTemplateFromDir(dir: String){
	const templateFolder = this.app.vault.getAbstractFileByPath(dir);
	var templatePath = this.app.vault.getResourcePath(templateFolder.children[0]);
	templatePath = templatePath.split("?")[0].substr(12);
	const template = fs.readFileSync(templatePath).toString();
	return template;
}

function titleCase(str: string) {
	var splitStr = str.toLowerCase().split(' ');
	for (var i = 0; i < splitStr.length; i++) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	return splitStr.join(' ');
}
