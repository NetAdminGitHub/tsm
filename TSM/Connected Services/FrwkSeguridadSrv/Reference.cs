﻿//------------------------------------------------------------------------------
// <auto-generated>
//     Este código fue generado por una herramienta.
//     Versión de runtime:4.0.30319.42000
//
//     Los cambios en este archivo podrían causar un comportamiento incorrecto y se perderán si
//     se vuelve a generar el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace TSM.FrwkSeguridadSrv {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="FrwkSeguridadSrv.ISeguridad")]
    public interface ISeguridad {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/ISeguridad/Encriptar", ReplyAction="http://tempuri.org/ISeguridad/EncriptarResponse")]
        string Encriptar(string TextoAEncriptar, string App);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/ISeguridad/Encriptar", ReplyAction="http://tempuri.org/ISeguridad/EncriptarResponse")]
        System.Threading.Tasks.Task<string> EncriptarAsync(string TextoAEncriptar, string App);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/ISeguridad/Desencriptar", ReplyAction="http://tempuri.org/ISeguridad/DesencriptarResponse")]
        string Desencriptar(string TextoEncriptado, string App);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/ISeguridad/Desencriptar", ReplyAction="http://tempuri.org/ISeguridad/DesencriptarResponse")]
        System.Threading.Tasks.Task<string> DesencriptarAsync(string TextoEncriptado, string App);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface ISeguridadChannel : TSM.FrwkSeguridadSrv.ISeguridad, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class SeguridadClient : System.ServiceModel.ClientBase<TSM.FrwkSeguridadSrv.ISeguridad>, TSM.FrwkSeguridadSrv.ISeguridad {
        
        public SeguridadClient() {
        }
        
        public SeguridadClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public SeguridadClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public SeguridadClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public SeguridadClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public string Encriptar(string TextoAEncriptar, string App) {
            return base.Channel.Encriptar(TextoAEncriptar, App);
        }
        
        public System.Threading.Tasks.Task<string> EncriptarAsync(string TextoAEncriptar, string App) {
            return base.Channel.EncriptarAsync(TextoAEncriptar, App);
        }
        
        public string Desencriptar(string TextoEncriptado, string App) {
            return base.Channel.Desencriptar(TextoEncriptado, App);
        }
        
        public System.Threading.Tasks.Task<string> DesencriptarAsync(string TextoEncriptado, string App) {
            return base.Channel.DesencriptarAsync(TextoEncriptado, App);
        }
    }
}
