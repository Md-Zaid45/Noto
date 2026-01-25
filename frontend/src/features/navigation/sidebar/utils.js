

export function generateTree(parentId = 'r',Folders,Notes){
  console.log("utils",Notes,Folders)
  return Folders
    .filter(folder => folder.parentFolderId === parentId)
    .map(folder => ({
      ...folder,
      children: generateTree(folder.id,Folders,Notes),
      notes: Notes.filter(note => note.folderId === folder.id),
    }));
}

export function fileTree(Folders,Notes){
  return {
      id: 'r',
      name: "",
      parentFolderId: null,
      revisionMark: true,
      children:generateTree('r', Folders, Notes),
      notes: Notes.filter((node) => node?.folderId==='r'),
      type: "folder",
    }}
export function parentFolder(nodeId,Notes){
  if(nodeId){
    console.log(Notes.find(node=>node.id===nodeId)?.folderId)
   return Notes.find(node=>node.id===nodeId)?.folderId;
  }else{console.log('nodeId is null')
    return null}
}

export function childrenIds(folderId,Notes,Folders){
  let idArray=[]
  idArray.push(folderId)
  idArray=idArray.concat(Notes?.filter(element => element.folderId===folderId).map(node=>node.id))
  Folders?.filter(element => element.parentFolderId===folderId)?.forEach(element=>{idArray=idArray.concat(childrenIds(element.id,Notes,Folders))})
    
  return idArray
}



