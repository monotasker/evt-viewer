angular.module('evtviewer.dataHandler')
   .factory('EvtSearchDiplomaticParLineParser', ['evtSearchDocument', 'XPATH', function (evtSearchDocument, XPATH) {
      function DiplomaticParLineParser(xmlDocBody) {
         this.parsedElementsForIndexing = {};
         this.xmlDocBody = xmlDocBody;
      }
   
      DiplomaticParLineParser.prototype.getPrevDocsInfo = function () {};
      
      DiplomaticParLineParser.prototype.parseElements = function () {
         var ns,
            nsResolver,
            xmlDocDom = this.xmlDocBody.ownerDocument;
   
         evtSearchDocument.hasNamespace(xmlDocDom);
         ns = evtSearchDocument.ns;
         nsResolver = evtSearchDocument.nsResolver;
   
         this.parsedElementsForIndexing = getParLineElements(xmlDocDom, this.xmlDocBody, ns, nsResolver);
         return this.parsedElementsForIndexing;
      };
   
      function getParLineElements(xmlDocDom, xmlDocBody, ns, nsResolver) {
         var parLineNodes;
      
         evtSearchDocument.removeNoteElements(xmlDocDom);
         parLineNodes = getFilteredNodes(xmlDocDom, xmlDocBody, ns, nsResolver);
         return getParLineInfo(xmlDocDom, xmlDocBody, parLineNodes, ns, nsResolver);
      }
   
      function getFilteredNodes(xmlDocDom, xmlDocBody, ns, nsResolver) {
         return ns ? xmlDocDom.evaluate(XPATH.ns.getParLineNodes, xmlDocBody, nsResolver, XPathResult.ANY_TYPE, null)
            : xmlDocDom.evaluate(XPATH.getParLineNodes, xmlDocBody, null, XPathResult.ANY_TYPE, null);
      }
      
      function getParLineInfo(xmlDocDom, xmlDocBody, parLineNodes, ns, nsResolver) {
         var currentXmlDoc = evtSearchDocument.getCurrentXmlDoc(xmlDocDom, xmlDocBody, ns, nsResolver),
            currentPage,
            currentPageId,
            pageId = 1,
            paragraph,
            parId = 1,
            documentToIndex = {},
            documentsToIndex = {},
   
            node = parLineNodes.iterateNext();
   
         while(node !== null) {
            var nodes = {
               'head': function() {
                  console.log();
               },
               'pb': function() {
                  currentPage = evtSearchDocument.getCurrentPage(node);
                  currentPageId = evtSearchDocument.getCurrentPageId(node, pageId);
                  pageId++;
               },
               'p': function () {
                  var paragraphChildNodes = getChildNodes(xmlDocDom, node, ns, nsResolver),
                     currentNode = paragraphChildNodes.iterateNext(),
                     parNodes = [];
                  
                  while(currentNode !== null) {
                     parNodes.push(currentNode);
                     currentNode = paragraphChildNodes.iterateNext();
                  }
                  
                  for(var i = 0; i < parNodes.length;) {
                     var currentParNodes;
                     
                     if(parNodes[i].nodeName === 'pb') {
                        currentPage = evtSearchDocument.getCurrentPage(parNodes[i]);
                        currentPageId = evtSearchDocument.getCurrentPageId(parNodes[i], pageId);
                        pageId++;
                        parNodes.splice(parNodes.indexOf(parNodes[i]), 1);
                     }
                     paragraph = evtSearchDocument.getParagraph(node, parId);
   
                     documentToIndex.xmlDocTitle = currentXmlDoc.title;
                     documentToIndex.xmlDocId = currentXmlDoc.id;
                     documentToIndex.paragraph = paragraph;
                     documentToIndex.page = currentPage;
                     documentToIndex.pageId = currentPageId;
                     documentToIndex.docId = documentToIndex.xmlDocId + '-' + documentToIndex.page + '-' + documentToIndex.paragraph;
                     
                     currentParNodes = evtSearchDocument.getCurrentPageParNodes(xmlDocDom, parNodes);
   
                     documentToIndex.content = evtSearchDocument.getContent(currentParNodes, '');
   
                     documentsToIndex[documentToIndex.docId] = documentToIndex;
                     currentParNodes = [];
                     documentToIndex = {};
                  }
                  parId++;
               },
               'l': function() {
                  console.log();
               }
            };
            nodes[node.nodeName]();
            node = parLineNodes.iterateNext();
         }
         return documentsToIndex;
      }
      
      function getChildNodes(xmlDocDom, node, ns, nsResolver) {
         return ns ? xmlDocDom.evaluate(XPATH.ns.getChildNodes, node, nsResolver, XPathResult.ANY_TYPE, null)
            : xmlDocDom.evaluate(XPATH.getChildNodes, node, null, XPathResult.ANY_TYPE, null);
      }
      
      return DiplomaticParLineParser;
   }]);