import PageList from "../../../../support/Pages/PageList";

const explorer = require("../../../../locators/explorerlocators.json");
import {
  apiPage,
  agHelper,
  entityExplorer,
  entityItems,
  jsEditor,
} from "../../../../support/Objects/ObjectsCore";
import { PageLeftPane } from "../../../../support/Pages/EditorNavigation";

const firstApiName = "First";
const secondApiName = "Second";

describe("Api Naming conflict on a page test", function () {
  it("1. Expects actions on the same page cannot have identical names", function () {
    // create an API
    apiPage.CreateApi(firstApiName);
    // create another API
    apiPage.CreateApi(secondApiName);
    PageLeftPane.expandCollapseItem("Queries/JS");
    // try to rename one of the APIs with an existing API name
    cy.get(`.t--entity-item:contains(${secondApiName})`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.selectAction("Edit name");
    cy.get(explorer.editEntity).last().type(firstApiName, { force: true });
    cy.validateMessage(firstApiName);
    agHelper.PressEnter();
    entityExplorer.ActionContextMenuByEntityName({
      entityNameinLeftSidebar: secondApiName,
      action: "Delete",
      entityType: entityItems.Api,
    });
    entityExplorer.ActionContextMenuByEntityName({
      entityNameinLeftSidebar: firstApiName,
      action: "Delete",
      entityType: entityItems.Api,
    });
  });
});

describe("Api Naming conflict on different pages test", function () {
  it("2. It expects actions on different pages can have identical names", function () {
    // create a new API
    cy.CreateAPI(firstApiName);
    PageLeftPane.expandCollapseItem("Queries/JS", true);

    // create a new page and an API on that page
    PageList.AddNewPage();
    cy.CreateAPI(firstApiName);
    PageLeftPane.expandCollapseItem("Queries/JS", true);
    PageLeftPane.assertPresence(firstApiName);
    cy.get(`.t--entity-item:contains(${firstApiName})`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.deleteActionAndConfirm();
    cy.get(`.t--entity-item:contains(Page2)`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.deleteActionAndConfirm();
    cy.get(`.t--entity-item:contains(${firstApiName})`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.deleteActionAndConfirm();
    cy.wait(1000);
  });
});

describe("Entity Naming conflict test", function () {
  it("3. Expects JS objects and actions to not have identical names on the same page.", function () {
    PageLeftPane.expandCollapseItem("Queries/JS", true);
    // create JS object and name it
    jsEditor.CreateJSObject('return "Hello World";');
    entityExplorer.RenameEntityFromExplorer("JSObject1", firstApiName);
    cy.wait(2000); //for the changed JS name to reflect

    cy.CreateAPI(secondApiName);

    cy.get(`.t--entity-item:contains(${secondApiName})`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.selectAction("Edit name");

    cy.get(explorer.editEntity).last().type(firstApiName, { force: true });
    entityExplorer.ValidateDuplicateMessageToolTip(firstApiName);
    cy.get("body").click(0, 0);
    cy.wait(2000);
    cy.get(`.t--entity-item:contains(${firstApiName})`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.deleteActionAndConfirm();
    cy.get(`.t--entity-item:contains(${secondApiName})`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.deleteActionAndConfirm();
  });
});
