// import React, { useState } from "react";
// import Modal from "react-modal";

// Modal.setAppElement("#root");

// const typeOptions = [
//   { key: "TOURIST_ATTRACTION", label: "Điểm tham quan" },
//   { key: "RESTAURANT", label: "Nhà hàng" },
//   { key: "SHOPPING", label: "Mua sắm" },
//   { key: "PARK", label: "Công viên" },
//   { key: "CULTURAL_SITE", label: "Di tích văn hóa" },
//   { key: "ACCOMMODATION", label: "Nơi ở" },
//   { key: "ENTERTAINMENT", label: "Giải trí" },
//   { key: "TRANSPORT_HUB", label: "Trạm trung chuyển" },
//   { key: "EVENT", label: "Sự kiện" },
//   { key: "ADVENTURE", label: "Phiêu lưu" },
//   { key: "HEALTH_WELLNESS", label: "Sức khỏe & Wellness" },
//   { key: "EDUCATIONAL", label: "Giáo dục" },
//   { key: "FUNCTIONAL", label: "Chức năng" },
//   { key: "ADMINISTRATIVE", label: "Hành chính" },
// ];

// interface GeneratePlaceModalProps {
//   isOpen: boolean;
//   onRequestClose: () => void;
//   onSelectType: (selectedTypes: string[]) => void;
// }

// const GeneratePlaceModal: React.FC<GeneratePlaceModalProps> = ({
//   isOpen,
//   onRequestClose,
//   onSelectType,
// }) => {
//   const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

//   const handleCheckboxChange = (type: string) => {
//     if (selectedTypes.includes(type)) {
//       setSelectedTypes(selectedTypes.filter((selected) => selected !== type));
//     } else {
//       setSelectedTypes([...selectedTypes, type]);
//     }
//   };

//   const handleSubmit = () => {
//     if (selectedTypes.length > 0) {
//       onSelectType(selectedTypes);
//       onRequestClose();
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onRequestClose}
//       contentLabel="Select Place Types"
//       className="modal-content"
//       overlayClassName="modal-overlay"
//     >
//       <div className="p-6 bg-white max-w-md mx-auto">
//         <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
//           Chọn các loại địa điểm
//         </h2>
//         <ul className="space-y-4">
//           {typeOptions.map((option) => (
//             <li key={option.key} className="flex items-center">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={selectedTypes.includes(option.key)}
//                   onChange={() => handleCheckboxChange(option.key)}
//                   className="form-checkbox text-primary h-5 w-5"
//                 />
//                 <span className="ml-3 text-gray-700">{option.label}</span>
//               </label>
//             </li>
//           ))}
//         </ul>
//         <div className="mt-6 text-center">
//           <button
//             onClick={handleSubmit}
//             className="px-6 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition duration-300"
//           >
//             Xác nhận
//           </button>
//           <button
//             onClick={onRequestClose}
//             className="ml-4 px-6 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition duration-300"
//           >
//             Hủy
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default GeneratePlaceModal;
