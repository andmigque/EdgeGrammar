using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;


namespace EdgeGrammar.Modules.Storage;

public class FirestoreClient
{
    public static string pathToAccountJson { get; set; } = Environment.GetEnvironmentVariable("EDGE_GRAMMAR_ACCOUNT_JSON");
    public static string googleApiUrl { get; set; } = "https://www.googleapis.com/auth/datastore";

    public GoogleCredential credential;
    public FirestoreDb firestoreDb;
    public FirestoreClient()
    {

    }

    public static GoogleCredential GetCredential() => CredentialFactory
            .FromFile<ServiceAccountCredential>(pathToAccountJson)
            .ToGoogleCredential()
            .CreateScoped(googleApiUrl);

    async static public Task<FirestoreDb> GetFirestoreDb(string projectId, GoogleCredential credential)
    {
        return await new FirestoreDbBuilder
        {
            ProjectId = projectId,
            Credential = credential
        }.BuildAsync();
    }


}
