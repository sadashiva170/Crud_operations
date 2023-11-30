import React from 'react';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import PopupMessage from './PopupMessage';

function TablePage() {
  const [data, setData] = React.useState([
    { "Student Name": "sada", "Student ID": 14993, "Marks": 90.5, "Passed": true },
    { "Student Name": "shiva", "Student ID": 1895, "Marks": 32, "Passed": false },

  ]);

  const [isFormOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState('create');
  const [formIndex, setFormIndex] = React.useState(null);
  const [formData, setFormData] =React.useState({
    "Student Name": "",
    "Student ID": "",
    "Marks": "",
    "Passed": false,
  });

  const [selectedRows, setSelectedRows] = React.useState([]);
  const [successMessage, setSuccessMessage] = React.useState('');

  const openForm = (mode, index) => {
    setFormOpen(true);
    setFormMode(mode);
    setFormIndex(index);
    setFormData(index !== null ? data[index] : {
      "Student Name": "",
      "Student ID": "",
      "Marks": "",
      "Passed": false,
    });
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormMode('create');
    setFormIndex(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "Marks" && (value < 0 || value > 100)) {
      setSuccessMessage("marks range is 0 to 100")
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAction = () => {
    if (formMode === 'create') {
      setData((prevData) => [...prevData, formData]);
      setSuccessMessage('Created successfully');
    } else if (formMode === 'update' && formIndex !== null) {
      setData((prevData) => {
        const newData = [...prevData];
        newData[formIndex] = formData;
        return newData;
      });
      setSuccessMessage('Updated successfully');
    }
    closeForm();
  };

  const handleDelete = (index) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData.splice(index, 1);
      return newData;
    });
    setSuccessMessage('Deleted successfully');
  };

  const handleToggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((_, index) => index));
    }
  };

  const handleToggleSelectRow = (index) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(index)) {
        return prevSelectedRows.filter((i) => i !== index);
      } else {
        return [...prevSelectedRows, index];
      }
    });
  };
const handleDeleteSelected = () => {
  setData((prevData) => {
    const newData = [...prevData];
    selectedRows.sort((a, b) => b - a);

    selectedRows.forEach((index) => {
      newData.splice(index, 1);
    });

    setSelectedRows([]);
    return newData;
  });
  setSuccessMessage('Selected Rows deleted successfully');
};


  const downloadExcel = (Data, fileName) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(Data);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(blob, fileName + fileExtension);
    setSuccessMessage('Downloaded successfully');
  };

  const handleDownload = () => {
    const fileName = 'crudOperations';
    downloadExcel(data, fileName);
  };

  return (
    <div className='main-div'>
      <div>
        <h1>CRUD OPERATIONS</h1>
      </div>
      <div className='table-div'>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length}
                  onChange={handleToggleSelectAll}
                />
                Select All
              </th>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Marks</th>
              <th>Passed</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(index)}
                    onChange={() => handleToggleSelectRow(index)}
                  />
                </td>
                <td>{row["Student Name"]}</td>
                <td>{row["Student ID"]}</td>
                <td>{row.Marks}</td>
                <td>{row.Passed ? 'true' : 'false'}</td>
                <td>
                  <button className='update-button' onClick={() => openForm('update', index)}>Update</button>
                  <button className='update-button' onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className='create-button' onClick={() => openForm('create', null)}>Create</button>
      <button className='create-button' onClick={handleDownload}>Download Excel</button>
      <button className='create-button' onClick={handleDeleteSelected}>Delete Selected</button>
      {isFormOpen === true && (
        <div className="form-popup">
          <h2>{formMode === 'create' ? 'Create Form' : 'Update Form'}</h2>
          <div className="form-row">
            <label className="form-label">Student Name:</label>
            <input type="text" name="Student Name" value={formData["Student Name"]} onChange={handleFormChange} />
          </div>
          <div className="form-row">
            <label className="form-label">Student ID:</label>
            <input type="number" name="Student ID" value={formData["Student ID"]} onChange={handleFormChange} />
          </div>
          <div className="form-row">
            <label className="form-label">Marks:</label>
            <input type="number" name="Marks" value={formData["Marks"]} onChange={handleFormChange} />
          </div>
          <div className="form-row">
            <label className="form-label">Passed:</label>
            <input type="checkbox" name="Passed" checked={formData["Passed"]} onChange={handleFormChange} />
          </div>
          <div className='btns'>
            <button className='create' onClick={handleAction}>{formMode === 'create' ? 'Create' : 'Update'}</button>
            <button className='cancel' onClick={closeForm}>Cancel</button>
          </div>
        </div>
      )}
        {successMessage && (
        <PopupMessage message={successMessage} onClose={() => setSuccessMessage('')} />
      )}
    </div>
  );
}

export default TablePage;
