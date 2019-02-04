﻿//------------------------------------------------------------------------------
// <auto-generated>
//     Este código fue generado por una herramienta.
//     Versión de runtime:4.0.30319.42000
//
//     Los cambios en este archivo podrían causar un comportamiento incorrecto y se perderán si
//     se vuelve a generar el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace TSM.FrwkAuthSrv {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="FrwkAuthSrv.IAuth")]
    public interface IAuth {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IAuth/Action", ReplyAction="http://tempuri.org/IAuth/ActionResponse")]
        string Action(string jTrama);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IAuth/Action", ReplyAction="http://tempuri.org/IAuth/ActionResponse")]
        System.Threading.Tasks.Task<string> ActionAsync(string jTrama);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IAuth/getUserLDAP", ReplyAction="http://tempuri.org/IAuth/getUserLDAPResponse")]
        System.Collections.Generic.Dictionary<string, string>[] getUserLDAP(string user);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IAuth/getUserLDAP", ReplyAction="http://tempuri.org/IAuth/getUserLDAPResponse")]
        System.Threading.Tasks.Task<System.Collections.Generic.Dictionary<string, string>[]> getUserLDAPAsync(string user);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface IAuthChannel : TSM.FrwkAuthSrv.IAuth, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class AuthClient : System.ServiceModel.ClientBase<TSM.FrwkAuthSrv.IAuth>, TSM.FrwkAuthSrv.IAuth {
        
        public AuthClient() {
        }
        
        public AuthClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public AuthClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public AuthClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public AuthClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public string Action(string jTrama) {
            return base.Channel.Action(jTrama);
        }
        
        public System.Threading.Tasks.Task<string> ActionAsync(string jTrama) {
            return base.Channel.ActionAsync(jTrama);
        }
        
        public System.Collections.Generic.Dictionary<string, string>[] getUserLDAP(string user) {
            return base.Channel.getUserLDAP(user);
        }
        
        public System.Threading.Tasks.Task<System.Collections.Generic.Dictionary<string, string>[]> getUserLDAPAsync(string user) {
            return base.Channel.getUserLDAPAsync(user);
        }
    }
}
