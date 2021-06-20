export const initiateDocumentBrowser = (viewer,doc ) => {
    var viewables = doc.getRoot().getDefaultGeometry();
    viewer.loadDocumentNode(doc, viewables).then(node => {
            if (node.isAEC()) {
                doc.downloadAecModelData().then(x => {
                    viewer.loadExtension('Autodesk.DocumentBrowser');
                });
            }
        }
    )
}
