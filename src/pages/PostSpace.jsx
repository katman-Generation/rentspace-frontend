import Navbar from "../components/Navbar";

export default function PostSpace() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold text-emerald-700 mb-6">
            Post a Space
          </h2>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Title"
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none md:col-span-2"
            />

            <select className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none">
              <option>Space Type</option>
              <option>House</option>
              <option>Room</option>
              <option>Shop</option>
              <option>Warehouse</option>
              <option>Event Space</option>
            </select>

            <input
              type="number"
              placeholder="Price"
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
            />

            <input
              type="text"
              placeholder="City"
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
            />

            <input
              type="text"
              placeholder="Area"
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
            />

            <textarea
              placeholder="Description"
              rows="4"
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none md:col-span-2"
            />

            <input
              type="file"
              multiple
              className="md:col-span-2"
            />

            <button className="md:col-span-2 bg-emerald-700 text-white py-2 rounded-lg hover:bg-emerald-800">
              Submit Space
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
