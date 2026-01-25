export const UiController = {
  sidebarContextMenu: null,
  activeInput: null,
  rename: null,
  resetActive: null,
  handler(e) {
    if (this.activeInput && !e.target.closest("[data-input-file]")) {
      console.log("inside uicontroller", this.activeInput);
      this.activeInput.close();
    }
    if (this.sidebarContextMenu && !e.target.closest("[data-context-menu]")) {
      this.sidebarContextMenu.close();
    }
    if (
      this.resetActive &&
      !e.target.closest("[data-tree-header]") &&
      e.target.closest("[data-left-sidebar]")
    ) {
      this.resetActive.reset();
    }
    if(this.rename && !this.rename?.ref?.current?.contains(e.target)){
      this.rename.close()
    }
  },
};
