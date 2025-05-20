/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import DestinationItem from "./DestinationItem";
import MapDetails from "./MapDetails";
import SearchInput from "../SearchInput/SearchInput";
import { toast } from "react-toastify";
import axios from "axios";
import { RootState } from "../../redux/store/store";
import { Destination, Result } from "../../redux/type";
import { useDispatch } from "react-redux";
import {
  addDay,
  removeDay,
  removeDestinationFromDay,
  setAPIResultData,
  setSelectedDay,
  setViewingMap,
  updateResult,
} from "./destinationsSlice";

const reorder = (list: Destination[], startId: number, endId: number) => {
  const result = Array.from(list);
  console.log(list);

  console.log(result);
  const startIndex = result.findIndex((item) => item.id === startId);
  const endIndex = result.findIndex((item) => item.id === endId);
  const [removed] = result.splice(startIndex, 1);
  console.log(removed);
  result.splice(endIndex, 0, removed);

  return result;
};
const Handcrafted: React.FC = () => {
  const results = useSelector((state: RootState) => state.destinations.results);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const tripId = useSelector((state: RootState) => state.destinations.id);
  const tripPermission = useSelector(
    (state: RootState) => state.destinations.permission
  );
  const canEdit = tripPermission === "OWNER" || tripPermission === "EDIT";
  const [newDestinations, setNewDestinations] = useState<{
    [key: string]: string;
  }>({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_API}/trip/itineraries/${tripId}/trip`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        dispatch(setAPIResultData(response.data.result));
        console.log("hand ", response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể lấy dữ liệu lịch trình!");
      }
    };

    fetchData();
  }, [tripId, dispatch]);

  const handleAddDay = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const newDay = {
        note: "themngay",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API}/trip/itineraries/${tripId}/trip`,
        newDay,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        const newDayData: Result = {
          id: response.data.result.id,
          note: response.data.result.note || "themngay",
          day: response.data.result.day,
          destinations: [],
        };
        dispatch(addDay(newDayData));

        toast.success("Tạo ngày mới thành công!");
      } else {
        toast.error("Tạo ngày mới thất bại!");
      }
    } catch (error) {
      console.error("Error adding new day:", error);
      toast.error("Có lỗi trong quá trình tạo ngày!");
    }
  };

  const handleSelectResult = async (result: any, dayId: number) => {
    const { place_id } = result;
    const locationId = place_id;
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_API}/trip/itineraries/${dayId}`,
        { locationId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(updateResult({ result: response.data.result }));
        toast.success("Thêm địa điểm mới thành công!");
      } else {
        toast.error("Không thể thêm địa điểm mới!");
      }
    } catch (error) {
      console.error("Error adding destination:", error);
      toast.error("Có lỗi trong quá trình thêm địa điểm!");
    }
  };

  const handleInputChange = (date: string, value: string) => {
    setNewDestinations({ ...newDestinations, [date]: value });
  };

  const handleRemoveDay = async (dayId: number) => {
    if (results.length === 1) {
      toast.error("You cannot delete all days!");
      return;
    }

    const firstDayId = results[0].id;
    const lastDayId = results[results.length - 1].id;

    if (dayId !== firstDayId && dayId !== lastDayId) {
      toast.error("Chỉ được xóa ngày đầu và ngày cuối!");
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_API}/trip/itineraries/${dayId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          data: { tripId: tripId },
        }
      );
      dispatch(removeDay(dayId));

      toast.success("Xóa ngày thành công!");
    } catch (error) {
      console.error("Error deleting day:", error);
      toast.error("Gặp lỗi trong quá trình xóa ngày!");
    }
  };

  const handleRemoveDestination = async (
    dayId: number,
    destinationId: number
  ) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BASE_API
        }/trip/itineraries/${destinationId}/destination`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            itineraryId: dayId,
          },
        }
      );
      dispatch(removeDestinationFromDay({ dayId, destinationId }));

      toast.success("Xóa địa điểm thành công!");
    } catch (error) {
      console.error("Error deleting destination:", error);
      toast.error("Có lỗi trong quá trình xóa địa điểm!");
    }
  };

  const handleGoToMap = (date: string) => {
    dispatch(setSelectedDay(date));
    setSelectedDate(date);
    dispatch(setViewingMap(true));
  };

  const handleBackToList = () => {
    dispatch(setViewingMap(false));
    setSelectedDate(null);
  };
  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const key = result.source.droppableId;
    const desKey = result.destination.droppableId;

    if (key !== desKey) {
      return;
    } else {
      const curResult = results.find((result) => result.id === parseInt(key));
      if (!curResult) return;
      const destinations = curResult.destinations;
      if (!destinations) return;
      const item = reorder(
        destinations,
        result.source.index,
        result.destination.index
      );
      console.warn(item);

      dispatch(updateResult({ result: { ...curResult, destinations: item } }));
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Accept: "application/json",
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        Authorization: `Bearer ${accessToken}`,
      };
      try {
        const data = {
          fromId: destinations[result.source.index].id,
          toId: destinations[result.destination.index].id,
          sourceId: parseInt(key),
          destinationId: parseInt(desKey),
        };

        console.log("data drop", data);
        const response = await axios.put(
          `${import.meta.env.VITE_BASE_API}/trip/itineraries/swap`,
          data,
          {
            headers,
          }
        );
        if (response.status === 200) {
          toast.success("Cập nhật vị trí địa điểm thành công!");
        }
      } catch (error) {
        console.log(error);
        toast.error("Cập nhật vị trí địa điểm thất bại!");
      }
    }
  };

  return (
    <div className="space-y-6">
      {results.map((day: Result) => (
        <div
          key={day.id}
          className="bg-white dark:bg-slate-600 dark:text-primary rounded-lg shadow-lg overflow-hidden"
        >
          <div className="flex justify-between items-center bg-gradient-to-r from-primary to-secondary p-4">
            <h3 className="text-xl font-semibold text-white">
              {new Date(day.day).toLocaleDateString("vi-VN")}
            </h3>
            {canEdit && (
              <button
                onClick={() => handleRemoveDay(day.id)}
                className="text-white remove-day-button text-sm font-semibold hover:underline"
              >
                Xóa
              </button>
            )}
          </div>

          {selectedDate &&
          new Date(selectedDate).toDateString() ===
            new Date(day.day).toDateString() ? (
            <MapDetails day={day} onBack={handleBackToList} />
          ) : (
            <div className="p-4">
              {canEdit && (
                <SearchInput
                  value={newDestinations[day.day.toString()] || ""}
                  onChange={(value) =>
                    handleInputChange(day.day.toString(), value)
                  }
                  dayId={day.id}
                  onSelectResult={(result) =>
                    handleSelectResult(result, day.id)
                  }
                />
              )}

              {canEdit ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId={day.id.toString()}>
                    {(provided) => (
                      <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-3 mt-4"
                      >
                        {day.destinations.map((destination, index) => (
                          <Draggable
                            key={destination.id}
                            draggableId={String(destination.id)}
                            index={index}
                          >
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="destination-item flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow-md"
                              >
                                <div className="flex-1 destination-item">
                                  <DestinationItem
                                    destination={destination}
                                    onRemove={() =>
                                      handleRemoveDestination(
                                        day.id,
                                        destination.id
                                      )
                                    }
                                    canRemove={canEdit}
                                  />
                                </div>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <ul className="space-y-3 mt-4">
                  {day.destinations.map((destination) => (
                    <li
                      key={destination.id}
                      className="destination-item flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow-md"
                    >
                      <div className="flex-1 destination-item">
                        <DestinationItem
                          destination={destination}
                          onRemove={() =>
                            handleRemoveDestination(day.id, destination.id)
                          }
                          canRemove={canEdit}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => handleGoToMap(day.day.toString())}
                  className="map-button bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-6 py-3 rounded-full transition duration-300 ease-in-out"
                >
                  Tiến hành
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {canEdit && results.length > 0 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={handleAddDay}
            className="relative add-day-button bg-secondary text-white text-lg p-2 rounded-lg shadow-lg flex items-center justify-center transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl"
          >
            Thêm ngày
            <span className="absolute inset-0 h-full w-full bg-white opacity-0 rounded-full transition-opacity duration-300 ease-in-out hover:opacity-20"></span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Handcrafted;
