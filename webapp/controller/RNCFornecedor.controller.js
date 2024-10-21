sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/ui/table/Column",
    'sap/m/MessageBox',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, ODataModel, ValueHelpDialog, ColumnListItem, Text, Column, MessageBox) {
        "use strict";

        var countAdd = 0;
        var oLengthCausa = 1;
        var oLengthMedida = 1;

        return Controller.extend("com.inbetta.rncfornecedor.controller.RNCFornecedor", {
            
            onInit: function () {
                var oModel = this.getOwnerComponent().getModel();
                this.getView().setModel(oModel);

                var iNotaId = "000200000129";
                var itemNota = "0001";
                if(iNotaId == 0){
                    MessageToast.show("Nenhuma nota foi informada");
                    return;
                }

                this.onRead(iNotaId,itemNota);

            },

            onReadQmnum: function(){
                // var iNotaId = "000200000129";
                // if(iNotaId == 0){
                //     MessageToast.show("Crie um cabeçalho de ordem primeiro");
                //     return;
                // }

                // this.onRead(iNotaId);
            },

            onRead: function(iNotaId,itemNota){
                var that   = this;
                var oModel = this.getOwnerComponent().getModel();

                // Definir as opções, incluindo o expand

                this.getView().setBusy(true);
                oModel.read("/RNCFornecedoresAppSet(Qmnum='"+iNotaId+"',Fenum='"+itemNota+"')",{
                    urlParameters: {
                        "$expand": "RNCFornecApp_toDescTxtNav"  // Nome da entidade filha a ser expandida
                    },
                    success: function(oData2, oResponse){
                        that.getView().setBusy(false);

                        that.getView().byId("iptNumNota").setValue(oData2.Qmnum);
                        that.getView().byId("iptDescNota").setValue(oData2.Qmtxt);
                        that.getView().byId("iptDtAbertura").setValue(oData2.Erdat);
                        that.getView().byId("iptStatusNota").setValue(oData2.Status);
                        that.getView().byId("iptMaterial").setValue(oData2.Material);
                        that.getView().byId("iptMaterialDesc").setValue(oData2.DescrMaterial);
                        that.getView().byId("iptQtdTot").setValue(oData2.QtdTotal);
                        that.getView().byId("iptQtdTotUM").setValue(oData2.Umqt);
                        that.getView().byId("iptFornecedor").setValue(oData2.Fornecedor);
                        that.getView().byId("iptFornecedorDesc").setValue(oData2.NomeForn);
                        that.getView().byId("iptQtdRep").setValue(oData2.QtdReprovada);
                        that.getView().byId("iptQtdRepUM").setValue(oData2.Umqr);
                        that.getView().byId("iptEmitente").setValue(oData2.Emitente);
                        that.getView().byId("iptItem").setValue(oData2.Fenum);
                        that.getView().byId("iptEmitenteDesc").setValue(oData2.NomeEmitente);
                        that.getView().byId("iptNmrLote").setValue(oData2.Nrlote);
                        
                        console.log(oData2);
                        console.log(oResponse);
                        MessageToast.show("Leitura realizada");
                    },
                    error: function(oError){
                        that.getView().setBusy(false);

                        console.log(oError);
                        var oObj = JSON.parse(oError.responseText);
                        MessageToast.show(oObj.error.message.value);
                    }
                });
                oModel.read("/RNCFornecedoresAppSet(Qmnum='"+iNotaId+"',Fenum='"+itemNota+"')/RNCFornecApp_toDescTxtNav",{
                    success: function(oData2, oResponse){
                        that.getView().setBusy(false);

                        // Inicializa a variável que irá armazenar o texto concatenado
                        var textoConcat = "";

                        // Lê todas as ocorrências no array "results" e concatena o valor do campo "Texto"
                        oData2.results.forEach(function(item) {
                            textoConcat += item.Texto + " ";  // Concatena o texto com um espaço entre as linhas
                        });

                        // Remove o espaço extra no final (opcional)
                        textoConcat = textoConcat.trim();

                        // Define o valor concatenado no TextArea com id "txtArea1"
                        that.getView().byId("txtArea1").setValue(textoConcat);

                        console.log(oData2);
                        console.log(oResponse);
                        MessageToast.show("Leitura descrição realizada");
                    },
                    error: function(oError){
                        that.getView().setBusy(false);

                        console.log(oError);
                        var oObj = JSON.parse(oError.responseText);
                        MessageToast.show(oObj.error.message.value);
                    }
                });
            },

            onValueHelpCausa: function (oEvent) {
                var oInput = oEvent.getSource();  // O input que acionou o evento
    
                // Criando o ValueHelpDialog
                var oValueHelpDialog = new ValueHelpDialog({
                    title: "Selecione o Código de Causa",
                    supportMultiselect: false,
                    key: "Code",  // Campo chave da tabela
                    descriptionKey: "Kurztext",  // Campo descritivo
                    ok: function (oEvent) {
                        // Quando o usuário selecionar um valor
                        var aTokens = oEvent.getParameter("tokens");
                        oInput.setValue(aTokens[0].getText());  // Define o valor no Input
                        oValueHelpDialog.close();
                    },
                    cancel: function () {
                        oValueHelpDialog.close();
                    }
                });
    
                // Configurando o modelo para o ValueHelpDialog
                oValueHelpDialog.setModel(this.getView().getModel());
    
                // Configurando o template das colunas no ValueHelpDialog
                var oTableColumns = new ColumnListItem({
                    cells: [
                        new Text({ text: "{Code}" }),  // Código de Causa
                        new Text({ text: "{Kurztext}" })  // Descrição
                    ]
                });
    
                // Configurando as colunas corretamente para sap.ui.table.Table
                oValueHelpDialog.getTable().addColumn(new Column({
                    label: new sap.m.Label({ text: "Código" }),  // Rótulo da coluna
                    template: new sap.m.Text({ text: "{Code}" })  // Template para o campo "Code"
                }));

                oValueHelpDialog.getTable().addColumn(new Column({
                    label: new sap.m.Label({ text: "Descrição" }),  // Rótulo da coluna
                    template: new sap.m.Text({ text: "{Kurztext}" })  // Template para o campo "Kurztext"
                }));

                // Fazendo o bind do template à entidade "QPCD" do OData
                oValueHelpDialog.getTable().bindRows({
                    path: "/VH_RNCCausasSet",  // Nome da Entity Set no OData
                    template: oTableColumns
                });
    
                // Abrindo o ValueHelpDialog
                oValueHelpDialog.open();
            },

            onValueHelpMedida: function (oEvent) {
                var oInput = oEvent.getSource();  // O input que acionou o evento
    
                // Criando o ValueHelpDialog
                var oValueHelpDialog = new ValueHelpDialog({
                    title: "Selecione o Código de Medida",
                    supportMultiselect: false,
                    key: "Code",  // Campo chave da tabela
                    descriptionKey: "Kurztext",  // Campo descritivo
                    ok: function (oEvent) {
                        // Quando o usuário selecionar um valor
                        var aTokens = oEvent.getParameter("tokens");
                        oInput.setValue(aTokens[0].getText());  // Define o valor no Input
                        oValueHelpDialog.close();
                    },
                    cancel: function () {
                        oValueHelpDialog.close();
                    }
                });
    
                // Configurando o modelo para o ValueHelpDialog
                oValueHelpDialog.setModel(this.getView().getModel());
    
                // Configurando o template das colunas no ValueHelpDialog
                var oTableColumns = new ColumnListItem({
                    cells: [
                        new Text({ text: "{Code}" }),  // Código de Medida
                        new Text({ text: "{Kurztext}" })  // Descrição
                    ]
                });
    
                // Configurando as colunas corretamente para sap.ui.table.Table
                oValueHelpDialog.getTable().addColumn(new Column({
                    label: new sap.m.Label({ text: "Código" }),  // Rótulo da coluna
                    template: new sap.m.Text({ text: "{Code}" })  // Template para o campo "Code"
                }));

                oValueHelpDialog.getTable().addColumn(new Column({
                    label: new sap.m.Label({ text: "Descrição" }),  // Rótulo da coluna
                    template: new sap.m.Text({ text: "{Kurztext}" })  // Template para o campo "Kurztext"
                }));

                // Fazendo o bind do template à entidade "QPCD" do OData
                oValueHelpDialog.getTable().bindRows({
                    path: "/VH_RNCMedidasSet",  // Nome da Entity Set no OData
                    template: oTableColumns
                });
    
                // Abrindo o ValueHelpDialog
                oValueHelpDialog.open();
            },

            onCausaAdd: function(oEvent) {
                var oPage = this.getView().byId("page");
                var oLength = oPage.getContent().length;
                var oPanel = this.getView().byId("panel21");
                var oPanelCopy = oPanel.clone();
                var oFormContent = oPanelCopy.getContent()[0].getContent()[0];
                var oFormContainer = oFormContent.getFormContainers()[0];
                var oFormElements = oFormContainer.getFormElements();
                if (oFormElements.length > 2) {
                    oFormElements.slice(0, 2);
                    var oElements = oFormElements;
                    oFormContainer.removeAllFormElements();
                    oFormContainer.insertFormElement(oElements[1]);
                    oFormContainer.insertFormElement(oElements[0]);
                }
                oFormElements[0].getFields()[0].setValue("");
                oFormElements[1].getFields()[0].setValue("");
                var oPage = this.getView().byId("page");
                var oPanelParent = oPanel.getParent();
                oPanelParent.insertContent(oPanelCopy, oLength + oLengthCausa);
                oLengthCausa++;

            },

            onMedidaAdd: function(oEvent) {
                if (countAdd <= 2){
                    var oPage = this.getView().byId("page");
                    var oLength = oPage.getContent().length;
                    var oPanel = this.getView().byId("panel31");
                    var oPanelCopy = oPanel.clone();
                    var oFormContent = oPanelCopy.getContent()[0].getContent()[0];
                    var oFormContainer = oFormContent.getFormContainers()[0];
                    var oFormElements = oFormContainer.getFormElements();
                    if (oFormElements.length > 2) {
                      oFormElements.slice(0, 2);
                      var oElements = oFormElements;
                      oFormContainer.removeAllFormElements();
                      oFormContainer.insertFormElement(oElements[1]);
                      oFormContainer.insertFormElement(oElements[0]);
                    }
                    oFormElements[0].getFields()[0].setValue("");
                    oFormElements[1].getFields()[0].setValue("");
                    var oPage = this.getView().byId("page");
                    var oPanelParent = oPanel.getParent();
                    oPanelParent.insertContent(oPanelCopy, oLength + oLengthMedida);
                    oLengthMedida++;
                }else{
                    MessageToast.show("Limite de medidas atingido.");
                }
                countAdd++;

            },

            onGravar : function(){
                var oDadosNota = this.onBuildDados();

                oModel.create("/RNCFornecedoresApp", oDadosNota,{
                    success: function (oData, response) {
                        MessageToast.show("Dados salvos com sucesso!");
                    },
                    error: function (oError) {
                        MessageBox.error("Erro ao salvar os dados.");
                    }
                })
                console.log("Dados",oDadosNota);

            },

            onBuildDados: function(){
                // Trata campo de data
                var dateEnvioRaw = this.getView().byId("dataInput").getValue();
                var sDATS = this.convertToDATS(dateEnvioRaw);

                //Monta os dados de cabeçalho
                var oDados = {
                    Qmnum : this.getView().byId("iptNumNota").getValue(),
                    Fenum : this.getView().byId("iptItem").getValue(),
                    Type : null,
                    Seq : null,
                    Qmtxt : null,
                    Erdat : null, 
                    Fornecedor : null,
                    NomeForn : null,
                    EmailForn : null,
                    Material : null,
                    DescrMaterial : null,
                    Status : null,
                    Fetxt : null,
                    OtkatOtgrp : null,
                    Otgrp : null,
                    Oteil : null,
                    Txtcdot : null,
                    OtkatFegrp : null,
                    Fegrp : null,
                    Fecod : null,
                    Txtcdfe : null,
                    Otver : null,
                    QuantDefects : null,
                    Emitente : null,
                    NomeEmitente : null,
                    Nrlote : null,
                    QtdTotal : null,
                    Umqt : null,
                    QtdReprovada : null,
                    Umqr : null,
                    Texto : null,
                    ZzrncPrxLotSan : this.getView().byId("loteInput").getValue(),
                    ZzrncDtEnvPrxLotSan : sDATS,
                    ZzrncIdentLote : this.getView().byId("identLoteInput").getValue(),
                    ZzrncResponsavel : this.getView().byId("iptResp").getValue(),
                    ZzrncCargo : this.getView().byId("iptCargo").getValue(),
                    ZzrncEmail : this.getView().byId("iptEmail").getValue(),
                    ZzrncFone : this.getView().byId("iptFone").getValue(),
                    toCausasMedidasNav :[]
                }

                //Adiciona os valores de causas ao JSON principal
                var oCausas = this.onGetCausas();
                if (oCausas != null){
                    oDados.toCausasMedidasNav.push(...oCausas);
                };
                
                var oMedidas = this.onGetMedidas();
                if (oMedidas != null){
                    oDados.toCausasMedidasNav.push(...oMedidas);
                };

                return oDados;

            },

            convertToDATS: function(sDate) {
                // Verifica se a data está no formato correto
                if (sDate && sDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)) {
                    // Divide a data em dia, mês e ano
                    var aDateParts = sDate.split("/");
                    var sDay = aDateParts[0];
                    var sMonth = aDateParts[1];
                    var sYear = aDateParts[2];
            
                    // Concatena os valores para formar o formato DATS (AAAAMMDD)
                    var sDATSFormat = sYear + sMonth + sDay;
            
                    // Retorna o valor da data no formato DATS
                    return sDATSFormat;
                } else {
                    // Se a data estiver em um formato inválido, você pode retornar um valor padrão ou tratar o erro
                    console.error("Data inválida. O formato esperado é DD/MM/YYYY.");
                    return null;
                }
            },

            onGetCausas: function() {
                var causaArray = []; // Matriz para armazenar todas as causas

                var inputsCausa = this.getView().findAggregatedObjects(true, function(oControl) {
                    var sId = oControl.getId();
                    
                    // Verifica se o id contém "iptCausa" e NÃO contém "-popup" ou "-vhi"
                    return sId.includes("iptCausa") && !sId.includes("-popup") && !sId.includes("-vhi");
                });

                var inputsDescCausa = this.getView().findAggregatedObjects(true, function(oControl) {
                    var sId = oControl.getId();
                    
                    return sId.includes("txtCausa") && !sId.includes("-counter");
                });
            
                // Iterar pelos inputs e textareas encontrados
                for (var i = 0; i < inputsCausa.length; i++) {
                    var causaId = inputsCausa[i].sId;
                    var descCausaId = inputsDescCausa[i].sId;

                    // Valida se o ID do input não contém "-popup"
                    if (!causaId.includes("-popup") && !causaId.includes("-vhi") && !descCausaId.includes("-counter")) {
                        var causaValue = inputsCausa[i]._lastValue;
                        var causaValueCode = this.extrairCodigo(causaValue);

                        var descCausaValue = inputsDescCausa[i]._lastValue;

                        // Adiciona um objeto com os valores à matriz
                        causaArray.push({
                            causa: causaValueCode,
                            descricao: descCausaValue
                        });
                    }
                }
                
                var oDadosCausas = this.onBuildCausas(causaArray);
                return oDadosCausas;

            },

            onGetMedidas: function() {
                var medidaArray = []; // Matriz para armazenar todas as medidas

                var inputsMedida = this.getView().findAggregatedObjects(true, function(oControl) {
                    var sId = oControl.getId();
                    
                    // Verifica se o id contém "iptMedida" e NÃO contém "-popup" ou "-vhi"
                    return sId.includes("iptMedida") && !sId.includes("-popup") && !sId.includes("-vhi");
                });

                var inputsDescMedida = this.getView().findAggregatedObjects(true, function(oControl) {
                    var sId = oControl.getId();
                    
                    return sId.includes("txtMedida") && !sId.includes("-counter");
                });

                // Iterar pelos inputs e textareas encontrados
                for (var i = 0; i < inputsMedida.length; i++) {
                    var medidaId = inputsMedida[i].sId;
                    var descMedidaId = inputsDescMedida[i].sId;

                    // Valida se o ID do input não contém "-popup"
                    if (!medidaId.includes("-popup") && !descMedidaId.includes("-counter")) {
                        var medidaValue = inputsMedida[i]._lastValue;
                        var medidaValueCode = this.extrairCodigo(medidaValue);
                        
                        var descMedidaValue = inputsDescMedida[i]._lastValue;

                        // Adiciona um objeto com os valores à matriz
                        medidaArray.push({
                            medida: medidaValueCode,
                            descricao: descMedidaValue
                        });
                    }
                }
                
                var oDadosMedidas = this.onBuildMedidas(medidaArray);
                return oDadosMedidas;
            },

            extrairCodigo: function(valor) {
                // Função auxiliar para reutilizar a lógica de extração
                var regex = /\(([^)]+)\)/;
                var match = valor.match(regex);
                return match ? match[1] : null;
            },

            onBuildCausas: function(causasJSON) {
                var that = this;
                // Define o tamanho máximo de caracteres por linha
                var maxCharPerLine = 132;
                
                // Array para armazenar o resultado final
                var jsonResult = [];
            
                // Itera sobre cada entrada no array de causas
                causasJSON.forEach(function(causaObj) {
                    var fullText = causaObj.descricao;
                    var index = 0;
                    var lines = [];
            
                    // Loop para quebrar o texto em linhas de 132 caracteres
                    while (index < fullText.length) {
                        // Pega um pedaço do texto com no máximo 132 caracteres
                        var line = fullText.substr(index, maxCharPerLine);
                        lines.push(line);
                        index += maxCharPerLine;
                    }
            
                    // Para cada linha gerada, cria um objeto com causa, sequencia, e texto
                    lines.forEach(function(line, idx) {
                        jsonResult.push({
                            Qmnum: that.getView().byId("iptNumNota").getValue(),
                            Fenum: that.getView().byId("iptNumNota").getValue(),
                            Codegruppe: 'QCAUSAS',
                            Code: causaObj.causa,   // Mantém o valor de "causa"
                            Seq: idx + 1,           // Sequência da linha
                            Texto: line.trim()      // Texto da linha
                        });
                    });
                });
            
                // Exibe o bloco JSON no console ou processa como desejar
                console.log(JSON.stringify(jsonResult, null, 2));
                return jsonResult;
            },

            onBuildMedidas: function(medidasJSON) {
                var that = this;
                // Define o tamanho máximo de caracteres por linha
                var maxCharPerLine = 132;
                
                // Array para armazenar o resultado final
                var jsonResult = [];
            
                // Itera sobre cada entrada no array de medida
                medidasJSON.forEach(function(medidaObj) {
                    var fullText = medidaObj.descricao;
                    var index = 0;
                    var lines = [];
            
                    // Loop para quebrar o texto em linhas de 132 caracteres
                    while (index < fullText.length) {
                        // Pega um pedaço do texto com no máximo 132 caracteres
                        var line = fullText.substr(index, maxCharPerLine);
                        lines.push(line);
                        index += maxCharPerLine;
                    }
            
                    // Para cada linha gerada, cria um objeto com medida, sequencia, e texto
                    lines.forEach(function(line, idx) {
                        jsonResult.push({
                            Qmnum: that.getView().byId("iptNumNota").getValue(),
                            Fenum: that.getView().byId("iptNumNota").getValue(),
                            Codegruppe: 'QMEDIDAS',
                            Code: medidaObj.medida,   // Mantém o valor de "medida"
                            Seq: idx + 1,           // Sequência da linha
                            Texto: line.trim()      // Texto da linha
                        });
                    });
                });
            
                // Exibe o bloco JSON no console ou processa como desejar
                console.log(JSON.stringify(jsonResult, null, 2));
                return jsonResult;
            }
        });
    });
