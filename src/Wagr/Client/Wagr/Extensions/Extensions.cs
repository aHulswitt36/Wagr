using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Text;

namespace Wagr.Extensions
{
    public static class Extensions
    {
        public static async Task<IJSObjectReference> ComponentModule<T>(this IJSRuntime runtime) where T : ComponentBase
        {
            var type = typeof(T);
            var sb = new StringBuilder("./js/");

            sb.Append(type.FullName.Remove(0, type.Assembly.GetName().Name.Length + 1).Replace(".", "/"));
            sb.Append(".js");

            var result = await runtime.InvokeAsync<IJSObjectReference>("import", sb.ToString());
            return result;
        }
    }
}
