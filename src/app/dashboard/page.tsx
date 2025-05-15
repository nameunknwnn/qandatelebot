import { prisma } from '@/lib/db';

  interface Query{
    id :string;
    username:string;
    userId:string;
    createdAt:string;
    query:string;
    response:string;

  }


// Make the component async since we're fetching data
export default async function Dashboard() {
  // Fetch queries from the database
  const queries = await prisma.query.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 50, // Get most recent 50 queries
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Telegram Bot Dashboard</h1>
      
      <h2 className="text-xl font-semibold mb-4">Recent Queries</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {queries.map((query:Query) => (
            <li key={query.id} className="px-6 py-4">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">User: {query.username || query.userId}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(query.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold">Query:</p>
                  <p>{query.query}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-semibold">Response:</p>
                  <p>{query.response}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}