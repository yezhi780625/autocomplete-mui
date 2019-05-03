import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  Chip,
  Popper,
  Paper,
  MenuItem,
  Checkbox,
  MenuList,
  Typography
} from "@material-ui/core";
import AutoComplete from "./AutoComplete";
import fetchData from "./fetchData";
import useFetch from "./useFetch";
import debounce from "lodash/debounce";
import "./styles.css";

const renderItem = ({ item, selected, style, uniKey, toggleItem }) => {
  return item ? (
    <MenuItem
      selected={selected}
      component="div"
      key={item[uniKey]}
      style={style}
    >
      <Checkbox
        checked={selected}
        onChange={(event, checked) => {
          toggleItem(item);
        }}
      />
      {item[uniKey]}
    </MenuItem>
  ) : null;
};
const renderItemList = ({
  items,
  loading,
  error,
  selectedItems,
  uniKey,
  toggleItem
}) => {
  if (loading)
    return (
      <span>
        <Typography component="em">Loading...</Typography>
      </span>
    );
  if (error)
    return (
      <span>
        <Typography component="em">{error.message}</Typography>
      </span>
    );
  if (items.length === 0)
    return (
      <span>
        <Typography component="em">No Result...</Typography>
      </span>
    );
  return items.map((item, index) =>
    item
      ? renderItem({
          item,
          index,
          selected:
            selectedItems.findIndex(
              selectedItem => selectedItem[uniKey] === item[uniKey]
            ) !== -1,
          style: {
            fontWeight:
              selectedItems.findIndex(
                selectedItem => selectedItem[uniKey] === item[uniKey]
              ) !== -1
                ? "bold"
                : "normal"
          },
          uniKey,
          toggleItem
        })
      : null
  );
};
function App() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [{ items, error }, setListData] = useState({
    items: [],
    error: null
  });
  const onSuccess = useCallback(data => {
    setListData({ items: data, error: null });
  }, []);
  const onError = useCallback(error => {
    setListData({ items: [], error });
  }, []);
  const { loading, setParams } = useFetch({ fetchData, onSuccess, onError });
  const onInputValueChange = useCallback(
    debounce(inputValue => {
      setParams({ q: inputValue });
    }, 300)
  );
  return (
    <div className="App">
      <AutoComplete
        items={items}
        loading={loading}
        error={error}
        onChange={selectedItems => setSelectedItems(selectedItems)}
        onInputValueChange={onInputValueChange}
        itemToString={item => (item ? item.value : "")}
        uniKey={"value"}
      >
        {({ isOpen, anchorEl, selectedItems, uniKey, toggleItem }) => {
          return isOpen ? (
            <Popper open={isOpen} anchorEl={anchorEl} disablePortal>
              <Paper
                square
                style={{
                  width: anchorEl ? anchorEl.clientWidth : null
                }}
              >
                <MenuList>
                  {renderItemList({
                    items,
                    loading,
                    error,
                    selectedItems,
                    uniKey,
                    toggleItem
                  })}
                </MenuList>
              </Paper>
            </Popper>
          ) : null;
        }}
      </AutoComplete>
      {selectedItems.map(item => (
        <Chip key={item.value} label={item.value} />
      ))}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
